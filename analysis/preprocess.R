# Set the working directory to the path where the script is saved.
setwd(dirname(sys.frame(1)$ofile))

# Force not to use scientific notation.
options(scipen = 999)

library(dplyr)
library(ggplot2)
library(lme4)
library(ordinal)

# Function to load raw data from PCIbex into a dataframe.
read.pcibex <- function(filepath, auto.colnames=TRUE, fun.col=function(col,cols){cols[cols==col]<-paste(col,"Ibex",sep=".");return(cols)}) {
  n.cols <- max(count.fields(filepath,sep=",",quote=NULL),na.rm=TRUE)
  if (auto.colnames){
    cols <- c()
    con <- file(filepath, "r")
    while ( TRUE ) {
      line <- readLines(con, n = 1, warn=FALSE)
      if ( length(line) == 0) {
        break
      }
      m <- regmatches(line,regexec("^# (\\d+)\\. (.+)\\.$",line))[[1]]
      if (length(m) == 3) {
        index <- as.numeric(m[2])
        value <- m[3]
        if (index < length(cols)){
          cols <- c()
        }
        if (is.function(fun.col)){
          cols <- fun.col(value,cols)
        }
        cols[index] <- value
        if (index == n.cols){
          break
        }
      }
    }
    close(con)
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=cols))
  }
  else{
    return(read.csv(filepath, comment.char="#", header=FALSE, col.names=seq(1:n.cols)))
  }
}

# Returns string without leading or trailing white space
# @see: https://stackoverflow.com/a/2261149
trim <- function (x) gsub("^\\s+|\\s+$", "", x)

# Aux function to get some common metrics.
getMetrics <- function(df, colName){
  res <-df %>% summarise(Mean=mean(!! sym(colName)), Median=median(!! sym(colName)) , SD=sd(!! sym(colName)), Min=min(!! sym(colName)), Max=max(!! sym(colName)))
  return(res)
}

# Function that returns the closest term to the given word from the provided 
# vocabulary. If no match, the original string is returned.
findClosestWord <- function(word, vocabulary, threshold=1) {
  # Convert word to lowercase.
  word <- tolower(word)
  # And trim it
  word <- trim(word)
  # If there is an exact match, return that word.
  if (word %in% vocabulary) {
    return(word)
  }
  
  # Get a mask of words that are 1 unit away.
  similarMask <- adist(word, vocabulary) == threshold
  
  # If there is just one similar word, we assume it was a typo and return that word.
  if (sum(similarMask) == 1) {
    return(vocabulary[similarMask])
  } else {
    return(word)
  }
}

# Aux function. Returns how many words there are in the vocabulary
# (both parameters are strings separated by spaces)
countWordsInVocabularyAsString <- function(words, vocabulary) {
  vocabulary <- strsplit(vocabulary, " ")[[1]]
  return (countWordsInVocabularyAsArray(words, vocabulary))
}

# Aux function. Returns how many words there are in the vocabulary
# (words is a string separated by spaces and vocabulary is an array)
countWordsInVocabularyAsArray <- function(words, vocabulary) {
  words <- strsplit(words, " ")[[1]]
  words <- unique(words)
  return (countWordsInVocabulary(words, vocabulary))
}

# Aux function. Returns how many words there are in the vocabulary (both are arrays)
countWordsInVocabulary <- function(words, vocabulary) {
  intersection <-intersect(words, vocabulary)
  return (length(intersection))
}

# Aux function. Returns TRUE if the word is in the vocabulary. The vocabulary is a string of words separated by spaces.
isWordInVocabularyAsString <- function(word, vocabulary) {
  count<-countWordsInVocabularyAsString(word, vocabulary)
  return(count>0)
}

# Load data.
raw_data <- read.pcibex("results.csv")

# Load the vocabulary.
df_words <- read.csv("words.csv", sep=";", header=TRUE)

df_words$len <- nchar(df_words$word)

# Define some variables for convenience.
nWords <- nrow(df_words)


# Minimum edit distance between vocabulary words.
minDistance <- 999

for (i in 1:length(df_words$word)) {
  for (j in 1:length(df_words$word)) {
    if (i == j) {
      next
    }
    if (minDistance > adist(df_words$word[i], df_words$word[j])) {
      minDistance <- adist(df_words$word[i], df_words$word[j])
    }
    if (2 > adist(df_words$word[i], df_words$word[j])) {
      print(df_words$word[i])
      print(df_words$word[j])
    }
  }
}

# Make sure that the minimum edit distance between the vocabulary is > 1.
print(minDistance)

# Try to replace the words that have been misspelled (when there is no ambiguity).
raw_data$filteredWords <- ""
maskRecall <- raw_data$PennElementName=="recall" & raw_data$Value!=""
raw_data$filteredWords[maskRecall] <- lapply(raw_data$Value[maskRecall], findClosestWord, df_words$word)

print(sum(maskRecall))

# Get how many typos were corrected.
maskTypo <- trim(tolower(raw_data$Value[maskRecall])) != raw_data$filteredWords[maskRecall]
raw_data$typo[maskRecall][maskTypo] <- 1
sum(maskTypo)

# Get how many unknown words were entered
maskUnknown <- ! raw_data$filteredWords[maskRecall] %in% df_words$word
raw_data$unknown[maskRecall][maskUnknown] <- 1
sum(maskUnknown)

# This is the number of unique responses (should match the # of participants)
timestamps<-unique(raw_data$Results.reception.time)
nReplies <- length(timestamps)
print(nReplies)

# Translate "Very True" - "Very untrue" into a 1-5 scale value.
raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="movies" & raw_data$Value=="Very True",]$Value <-1
raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="movies" & raw_data$Value=="True",]$Value <-2
raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="movies" & raw_data$Value=="Neutral",]$Value <-3
raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="movies" & raw_data$Value=="Untrue",]$Value <-4
raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="movies" & raw_data$Value=="Very untrue",]$Value <-5

raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="bored" & raw_data$Value=="Very True",]$Value <-5
raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="bored" & raw_data$Value=="True",]$Value <-4
raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="bored" & raw_data$Value=="Neutral",]$Value <-3
raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="bored" & raw_data$Value=="Untrue",]$Value <-2
raw_data[raw_data$Parameter=="Choice" & raw_data$PennElementName=="bored" & raw_data$Value=="Very untrue",]$Value <-1


# Create base df with fields:
## TrialID
## TrialDuration
## RecallDuration
## Age
## Gender
## SSScore
## RecalledWords
## TargetWords
## nRecalledCorrect

baseDF_raw <- data.frame(
  matrix(vector(), nReplies, 9,
  dimnames=list(c(), c("TrialID", "TrialDuration", "RecallDuration", "Age", "Gender", "SSScore", "RecalledWords", "TargetWords", "nRecalledCorrect"))),
  stringsAsFactors=F)


# Fill the baseDF_raw with the responses of each subject.
for (i in 1:nReplies) {
  response <- raw_data %>% filter(Results.reception.time==timestamps[i])
  
  # TrialID
  baseDF_raw$TrialID[i] <- i
  
  # TrialDuration
  startTime <- response %>% 
    filter(Label=="welcome" & Parameter=="_Trial_" & Value=="Start") %>% 
    select(EventTime)
  duration <- (timestamps[i]*1000 - startTime[1,1])/1000/60
  baseDF_raw$TrialDuration[i] <- as.numeric(duration)
  
  # RecallDuration
  startTime <- response %>% 
    filter(Label=="recall-trial" & Parameter=="_Trial_" & Value=="Start") %>% 
    select(EventTime)
  endTime <- response %>% 
    filter(Label=="recall-trial" & Parameter=="_Trial_" & Value=="End") %>% 
    select(EventTime)
  duration <- (endTime[1,1] - startTime[1,1])/1000/60
  baseDF_raw$RecallDuration[i] <- as.numeric(duration)
  
  
  # Age
  age <- response %>% filter(PennElementName=="age-input") %>% select(Value)
  baseDF_raw$Age[i] <- as.numeric(age[1,1])
  
  # Gender
  gender <- response %>% filter(PennElementName=="gender") %>% select(Value)
  baseDF_raw$Gender[i] <- gender[1,1]
  
  # SSScore 
  movieScore <- response %>% filter(PennElementName=="movies") %>% select(Value)
  boredScore <- response %>% filter(PennElementName=="bored") %>% select(Value)
  baseDF_raw$SSScore[i] <- (as.numeric(movieScore) + as.numeric(boredScore))/2
  
  # RecalledWords
  recalledWords <- response %>% filter(PennElementName=="recall" & filteredWords!= "") %>% select(filteredWords)
  recalledWords <- unique(recalledWords)
  baseDF_raw$RecalledWords[i] <- paste(recalledWords[["filteredWords"]], collapse=" ")
  
  # TargetWords
  targetWords <- response %>% 
    filter(Label=="welcome" & Parameter=="_Trial_" & Value=="Start") %>% 
    select(targetWords)
  baseDF_raw$TargetWords[i] <- targetWords
  
  # nRecalledCorrect
  baseDF_raw$nRecalledCorrect[i] <- countWordsInVocabulary(recalledWords[["filteredWords"]], df_words$word)
}

# Demographics data:
# Number of males and females
nrow(baseDF_raw %>% filter(Gender=="male"))
nrow(baseDF_raw %>% filter(Gender=="female"))

# nRecalledCorrect
getMetrics(baseDF_raw, "nRecalledCorrect")
# Age
getMetrics(baseDF_raw, "Age")
# Trial Duration
getMetrics(baseDF_raw, "TrialDuration")
# Recall duration
getMetrics(baseDF_raw, "RecallDuration")

# Let's have a look at how many unique words people recall correctly.
hist(baseDF_raw$nRecalledCorrect, breaks=20, main="Histogram of # of recalled words",xlab="# of recalled words" )

# Remove outliers based on the nRecalledCorrect, keeping the 95%
# meanRecalled <- mean(baseDF_raw$nRecalledCorrect)
# seRecalled <- sd(baseDF_raw$nRecalledCorrect)/sqrt(length(baseDF_raw$nRecalledCorrect))
# lowerBound <- meanRecalled - 2*seRecalled
# upperBound <- meanRecalled + 2*seRecalled

# Remove outliers based on the IQR (mean - 1.5*IQR, mean + 1.5*IQR)
IQR <- IQR(baseDF_raw$nRecalledCorrect)
lowerBound <- mean(baseDF_raw$nRecalledCorrect) - 1.5*IQR
upperBound <- mean(baseDF_raw$nRecalledCorrect) + 1.5*IQR

baseDF <- baseDF_raw %>% filter(nRecalledCorrect>lowerBound  & nRecalledCorrect<upperBound)
# Update nReplies
nReplies <- nrow(baseDF)

print(nReplies)



# Run again the metrics (after removing the outliers)
# Demographics data:
# Number of males and females
nrow(baseDF %>% filter(Gender=="male"))
nrow(baseDF %>% filter(Gender=="female"))

# nRecalledCorrect
getMetrics(baseDF, "nRecalledCorrect")
# Age
getMetrics(baseDF, "Age")
# Trial Duration
getMetrics(baseDF, "TrialDuration")
# Recall duration
getMetrics(baseDF, "RecallDuration")

# Create a DF to replicate the original analysis with the fields:
## TrialID
## TrialDuration
## Age
## Gender
## Target.Score
## Control.Score
## Precog.Score
## Precog.Score.Weighted
## SSScore
bemDF <- data.frame(
  matrix(vector(), nReplies, 9,
         dimnames=list(c(), c("TrialID", "TrialDuration", "Age", "Gender", "Target.Score", "Control.Score", "Precog.Score", "Precog.Score.Weighted", "SSScore"))),
  stringsAsFactors=F)

# Fill the bemDF with the responses of each Trial.
for (i in 1:nReplies) {
  response <- baseDF[i,]
  
  # TrialID
  bemDF$TrialID[i]<-response$TrialID
  # TrialDuration
  bemDF$TrialDuration[i]<-response$TrialDuration
  # Age
  bemDF$Age[i]<-response$Age
  # Gender
  bemDF$Gender[i]<-response$Gender
  # SSScore
  bemDF$SSScore[i]<-response$SSScore
  
  # Target.Score
  Target.Score<-countWordsInVocabularyAsString(response$RecalledWords, response$TargetWords[[1]])
  bemDF$Target.Score[i]<-Target.Score

  Control.Score<-countWordsInVocabularyAsArray(response$RecalledWords, df_words$word)
  Control.Score <- Control.Score - Target.Score
  bemDF$Control.Score[i]<-Control.Score

  # Precog.Score
  bemDF$Precog.Score[i]<- ((Target.Score - Control.Score)/24)*100

  # Precog.Score.Weighted
  bemDF$Precog.Score.Weighted[i]<-(((Target.Score - Control.Score)*(Target.Score +  Control.Score))/576)*100
  
  
}

# Original t-test:
t.test(bemDF$Precog.Score.Weighted,
       mu=0,
       paired=FALSE,
       alternative="two.sided")
# Effect size:
bemDF %>% cohens_d(Precog.Score.Weighted ~ 1, mu = 0)
# We can check it:
mean(bemDF$Precog.Score.Weighted)/sd(bemDF$Precog.Score.Weighted)

# High SSScore
t.test(bemDF %>% filter(SSScore>2.5) %>% select(Precog.Score.Weighted),
       mu=0,
       paired=FALSE,
       alternative="two.sided")

# Effect size:
bemDF %>% filter(SSScore>2.5) %>% cohens_d(Precog.Score.Weighted ~ 1, mu = 0)

# Low SSScore
t.test(bemDF %>% filter(SSScore<=2.5) %>% select(Precog.Score.Weighted),
       mu=0,
       paired=FALSE,
       alternative="two.sided")
# Effect size:
bemDF %>% filter(SSScore<=2.5) %>% cohens_d(Precog.Score.Weighted ~ 1, mu = 0)


# Global correlation
with(bemDF,
     cor.test(Precog.Score.Weighted, SSScore)
)

# ---------------------------------------------
# Non-weighted score
# Original t-test:
t.test(bemDF$Precog.Score,
       mu=0,
       paired=FALSE,
       alternative="two.sided")

# High SSScore
t.test(bemDF %>% filter(SSScore>2.5) %>% select(Precog.Score),
       mu=0,
       paired=FALSE,
       alternative="two.sided")

# Low SSScore
t.test(bemDF %>% filter(SSScore<=2.5) %>% select(Precog.Score),
       mu=0,
       paired=FALSE,
       alternative="two.sided")


# Global correlation
with(bemDF,
     cor.test(Precog.Score, SSScore)
)

# Create a DF to extend the original analysis with the fields:
## TrialID
## TrialDuration
## Age
## Gender
## SSScore
## Word
## Category
## Foods
## Clothing
## Animals
## Occupations
## Concrete
## Frequency
## Length
## WasRecalled
## WasTarget
extDF <- data.frame(
  matrix(vector(), nReplies*nWords, 17,
         dimnames=list(c(), c("TrialID", "Precognition.Score.Weighted", "TrialDuration", "Age", "Gender", "SSScore", "Word", "Category", "Foods", "Clothing", "Animals", "Occupations", "Concrete", "Frequency", "Length", "WasRecalled", "WasTarget"))),
  stringsAsFactors=F)

# Fill the bemDF with the responses of each Trial.
for (i in 1:nReplies) {
  response <- baseDF[i,]
  
  for (j in 1:nWords) {
    # Current index
    idx <- (i-1)*nWords + j
    
    # TrialID
    extDF$TrialID[idx]<-response$TrialID
    # Precognition.Score.Weighted
    extDF$Precognition.Score.Weighted[idx]<-bemDF[i,]$Precog.Score.Weighted
    # TrialDuration
    extDF$TrialDuration[idx]<-response$TrialDuration
    # Age
    extDF$Age[idx]<-response$Age
    # Gender
    extDF$Gender[idx]<-response$Gender
    # SSScore
    extDF$SSScore[idx]<-response$SSScore
   
    # Word
    extDF$Word[idx]<-df_words$word[j]
    # Category
    extDF$Category[idx]<-df_words$category[j]
    # Foods
    extDF$Foods[idx]<-df_words$category[j]=="foods"
    # Clothing
    extDF$Clothing[idx]<-df_words$category[j]=="clothing"
    # Animals
    extDF$Animals[idx]<-df_words$category[j]=="animals"
    # Occupations
    extDF$Occupations[idx]<-df_words$category[j]=="occupations"
    # Concrete
    extDF$Concrete[idx]<-df_words$category[j]!="occupations" 
    # Frequency
    extDF$Frequency[idx]<-df_words$freq[j]
    # Length
    extDF$Length[idx]<-nchar(df_words$word[j])
    
    # WasRecalled
    extDF$WasRecalled[idx]<- isWordInVocabularyAsString(df_words$word[j], baseDF$RecalledWords[i][[1]])
    
    # WasTarget
    extDF$WasTarget[idx]<- isWordInVocabularyAsString(df_words$word[j], baseDF$TargetWords[i][[1]])
  }
}

# Median of the word length
medianLength <- median((extDF %>% filter(TrialID ==1))$Length)
extDF$medianLength <- extDF$Length - medianLength

# Check the fixed effect hypothesis
m1 <- glmer(WasRecalled ~ 1 + WasTarget + (1 |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m2 <- glmer(WasRecalled ~ 1 + WasTarget + (1 |TrialID), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m3 <- glmer(WasRecalled ~ 1 + WasTarget + (1 |TrialID) + (1 |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m4 <- glmer(WasRecalled ~ 1 + WasTarget + (1 + WasTarget |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m5 <- glmer(WasRecalled ~ 1 + WasTarget + (1 + WasTarget |TrialID), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m6 <- glmer(WasRecalled ~ 1 + WasTarget + (1 + WasTarget |TrialID) + (1 + WasTarget |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
anova(m1, m2, m3, m4, m5, m6)

# Check the fixed effect hypothesis
m1 <- glmer(WasRecalled ~ 1 + WasTarget + (1 |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m2 <- glmer(WasRecalled ~ 1 + WasTarget + (1 |TrialID), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m3 <- glmer(WasRecalled ~ 1 + WasTarget + (1 |TrialID) + (1 |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m5 <- glmer(WasRecalled ~ 1 + WasTarget + (1 + WasTarget |TrialID) + (1 + WasTarget |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m4 <- glmer(WasRecalled ~ 1 + WasTarget + (1 + medianLength |TrialID) + (1 + medianLength |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m6 <- glmer(WasRecalled ~ 1 + WasTarget + (1 + log(Frequency) |TrialID) + (1 + log(Frequency) |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
m7 <- glmer(WasRecalled ~ 1 + WasTarget + (1 + scale(SSScore) |TrialID) + (1 + scale(SSScore) |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))
anova(m1, m2, m3, m4, m5, m6, m7)

m3.intercept <- glmer(WasRecalled ~ 1 + (1 |TrialID) + (1 |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))

anova(m3, m3.intercept)

m3.sss <- glmer(WasRecalled ~ 1 + WasTarget*SSScore + (1 |TrialID) + (1 |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))

anova(m3, m3.sss)
print(summary(m3.sss))

m4.full <- glmer(WasRecalled ~ 1 + WasTarget*SSScore + Category + log(Frequency) + medianLength + Gender + scale(Age) + (1 + medianLength |TrialID) + (1 + medianLength |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))

m3.full <- glmer(WasRecalled ~ 1 + WasTarget*SSScore + Category + log(Frequency) + medianLength + Gender + scale(Age) + (1 |TrialID) + (1 |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))

print(summary(m3.full))

print(summary(m4.full))

anova(m3.full, m4.full)

m3.cat <- glmer(WasRecalled ~ 1 + Category + (1 |TrialID) + (1 |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))

anova(m3.sss, m3.cat)

m3.freq.len <- glmer(WasRecalled ~ 1 + Category + medianLength + log(Frequency) + (1 |TrialID) + (1 |Word), extDF, family=binomial(link="logit"), control=glmerControl(optimizer = 'bobyqa'))

anova(m3, m3.cat, m3.freq.len)



catDF <- extDF %>% filter(Category=="animals") %>% group_by(TrialID) %>% summarise(x = sum(WasRecalled), category = "animals")

catDF <- rbind(catDF,
               extDF %>% filter(Category=="foods") %>% group_by(TrialID) %>% summarise(x = sum(WasRecalled), category = "foods")      
)
catDF <- rbind(catDF,
               extDF %>% filter(Category=="occupations") %>% group_by(TrialID) %>% summarise(x = sum(WasRecalled), category = "occupations")      
)
catDF <- rbind(catDF,
               extDF %>% filter(Category=="clothing") %>% group_by(TrialID) %>% summarise(x = sum(WasRecalled), category = "clothing")      
)

# Box plots
# ++++++++++++++++++++
# Plot weight by group and color by group
library("ggpubr")
ggboxplot(catDF, x = "category", y = "x", 
          color = "category", palette = c("#00AFBB", "#E7B800", "#FC4E07", "#006400"),
          order = c("foods", "animals" ,"occupations", "clothing"),
          y.ticks = c(0,1,2,3,4,5,6,7,8,9,10),
          ylab = "# words recalled", xlab = "Category", legend="")




# Compute the analysis of variance
res.aov <- aov(x ~ category, data = catDF)
# Summary of the analysis
summary(res.aov)

TukeyHSD(res.aov)
catDF %>% group_by(category) %>% summarise(mean=mean(x), sd=sd(x))


ggplot(catDF, aes(x=x, color=category)) +
  geom_histogram(fill="white", alpha=0.5, position="identity")


  

ggplot(catDF, aes(x=x, color=category)) +
  geom_histogram(aes(y=..density..), colour="black", fill="white") +
  geom_density(size=1.5, alpha=.2, fill="#FF6666")+
  xlab("# recalled words")


ggplot(catDF, aes(x=reorder(category, x, FUN = median), y=x, fill=category)) +
  geom_boxplot(show.legend = FALSE) +
  xlab("Category") +
  ylab(("# recalled words"))

  

res.aov.freq <- aov(freq ~ category, data = df_words)
summary(res.aov.freq)
TukeyHSD(res.aov.freq)

res.aov.len <- aov(len ~ category, data = df_words)
summary(res.aov.len)
TukeyHSD(res.aov.len)

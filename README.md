Project submitted by Alissa Hoevenaars and Cándido Otero for the INFOMEPL course at Utrecht University. 

## Getting started
Check out
- the working demo: https://farm.pcibex.net/r/XPIuJP/
- the collected data: https://github.com/omcandido/test_bem/tree/master/analysis
- the report: https://github.com/omcandido/test_bem/blob/master/Report.pdf

------------

User documentation at https://github.com/addrummond/ibex/blob/master/docs/manual.md

The following are some notes intended for developers.


1. Generating PDF documentation.
------------------------------------------------------------------------

Pandoc (http://pandoc.org) and LaTeX are required to generate PDF documentation.

Execute the following commands to generate a LaTeX version of the docs and then
compile it to a PDF:

    cd docs
    make manual.pdf


2. Packaging a release.
------------------------------------------------------------------------

You need to:

    * Run server.py with the --genhtml option to generate
      'experiment.html' and 'overview.html' in www/. For example, if
      you are in www/:

          python server.py --genhtml ./

    * Execute the following command from the root dir of the repo:

          sh mkdist.sh 0.3-beta-1234

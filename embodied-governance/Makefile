LATEX=pdflatex
BIB=bibtex

.PHONY: all figures paper clean


all: figures paper

figures:
	python3 scripts/make_figures.py

paper:
	$(LATEX) main.tex
	$(BIB) main
	$(LATEX) main.tex
	$(LATEX) main.tex

clean:
	rm -f *.aux *.bbl *.blg *.log *.out *.toc *.lof *.lot *.fls *.fdb_latexmk
	rm -f main.pdf

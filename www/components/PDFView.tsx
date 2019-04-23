import React, { useState, useEffect, useCallback } from "react";
// @ts-ignore: No types for this lib yet. TODO: create types for it and submit PR
import { Document, Page, pdfjs } from "react-pdf";
import styled, { createGlobalStyle } from "styled-components";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

const Pages = styled.div`
  width: 100%;
  display: flex;
`;

const PdfPage = createGlobalStyle`
  .pdfPage {
    border: 1rem solid gray;
  }
`;

const PageNumber = styled.div`
  display: flex;
  justify-content: space-around;
`;

interface Props {
  url: string;
}

const PDFView: React.FC<Props> = props => {
  const [pageNumber, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState<null | number>(null);
  const changePage = useCallback(
    (change: 1 | -1) => {
      if (change === -1) {
        setPage(page => {
          if (page > 1) {
            return page - 1;
          }
          return page;
        });
      } else {
        setPage(page => {
          if (!maxPages || page + 1 < maxPages) {
            return page + 1;
          }
          return page;
        });
      }
    },
    [maxPages]
  );
  useEffect(() => {
    document.onkeydown = e => {
      if (e.keyCode === 37) {
        changePage(-1);
      } else if (e.keyCode === 39) {
        changePage(1);
      }
    };
  }, [changePage]);

  return (
    <Document
      file={props.url}
      onLoadSuccess={({ numPages }: any) => setMaxPages(numPages)}
    >
      <PdfPage />
      <Pages>
        <button disabled={pageNumber === 1} onClick={() => changePage(-1)}>
          Prev
        </button>
        <div>
          <PageNumber>{pageNumber}</PageNumber>
          <Page className="pdfPage" pageNumber={pageNumber} />
        </div>
        <div>
          <PageNumber>{pageNumber + 1}</PageNumber>
          <Page className="pdfPage" pageNumber={pageNumber + 1} />
        </div>
        <button
          disabled={typeof maxPages === "number" && pageNumber === maxPages - 1}
          onClick={() => changePage(1)}
        >
          Next
        </button>
      </Pages>
    </Document>
  );
};

export default PDFView;

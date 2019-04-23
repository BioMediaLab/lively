import React, { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import PDFView from "./PDFView";

const saveBlob = (data: Blob, fileName: string) => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  (a as any).style = "display: none";
  const url = window.URL.createObjectURL(data);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

interface ReadDataRes {
  type: string;
  data: any;
}

const readBlobAsText = (blob: Blob): Promise<string> =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (!e.target) {
        rej(e);
      } else {
        const data = (e as any).target.result;
        res(data);
      }
    };
    reader.onerror = rej;
    reader.readAsText(blob);
  });

const readData = async (url: string): Promise<ReadDataRes> => {
  const resp = await fetch(url);
  const blob = await resp.blob();
  console.log(blob.type);
  if (/(text\/)|(application\/jso)\w+/.test(blob.type)) {
    return {
      type: "text",
      data: await readBlobAsText(blob)
    };
  }
  if (/(image\/)\w+/.test(blob.type)) {
    const tempurl = URL.createObjectURL(blob);
    return {
      type: "image",
      data: tempurl
    };
  }
  if (/(audio\/)\w+/.test(blob.type)) {
    const tempurl = URL.createObjectURL(blob);
    return {
      type: "audio",
      data: tempurl
    };
  }
  if (/(application\/pd)\w+/.test(blob.type)) {
    const tempurl = URL.createObjectURL(blob);
    return {
      type: "pdf",
      data: tempurl
    };
  }
  if (/(video\/mp4)/.test(blob.type)) {
    const tempurl = URL.createObjectURL(blob);
    return {
      type: "video",
      data: tempurl
    };
  }

  return {
    data: blob,
    type: "?"
  };
};

interface Props {
  url: string;
  name: string;
}

const FileViewer: React.FC<Props> = props => {
  const [data, setData] = useState<ReadDataRes | null>(null);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        setData(await readData(props.url));
      } catch (err) {
        setError(err);
      }
    })();
  }, [props.url]);

  if (error) {
    return <ErrorMessage message={JSON.stringify(error)} />;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data.type == "text") {
    return (
      <pre>
        <code>{data.data}</code>
      </pre>
    );
  }
  if (data.type == "image") {
    return (
      <img
        style={{ maxWidth: "100%", maxHeight: "300rem" }}
        src={data.data}
        alt={props.name}
      />
    );
  }
  if (data.type === "pdf") {
    return <PDFView url={data.data} />;
  }
  if (data.type === "audio") {
    return <audio src={data.data} controls />;
  }
  if (data.type === "video") {
    return <video src={data.data} controls />;
  }

  return (
    <div>
      Unsupported file type
      <div>
        <button onClick={() => saveBlob(data.data, props.name)}>
          Download?
        </button>
      </div>
    </div>
  );
};

export default FileViewer;

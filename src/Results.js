import React, { useMemo } from "react";

export const Results = ({ content, isError, isLink }) => {
  const contentHTML = useMemo(() => prettyPrint(content), [content]);
  const props = {
    className: "results",
  };
  if (isError) {
    props.className += " error";
    props.children = [String(content)];
    props.style = {
      color: "#FD4E43",
    };
  } else if (isLink) {
    props.children = [
      <a href={content} style={{ color: "white" }}>
        {content}
      </a>,
    ];
  } else {
    props.dangerouslySetInnerHTML = { __html: contentHTML };
  }

  return <pre {...props} />;
};

/**
 * Pretty Print JSON Objects.
 * Taken from https://codepen.io/decodigo/pen/amzrF
 */
function prettyPrint(obj) {
  const jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/gm;
  const replacer = function (match, pIndent, pKey, pVal, pEnd) {
    let key = '<span class="json-key" style="color: #D4CEFF">',
      val = '<span class="json-value" style="color: #21D7FF">',
      str = '<span class="json-string" style="color: #13E5C0">',
      r = pIndent || "";
    if (pKey) r = r + key + pKey.replace(/[": ]/g, "") + "</span>: ";
    if (pVal) r = r + (pVal[0] === '"' ? str : val) + pVal + "</span>";
    return r + (pEnd || "");
  };

  return JSON.stringify(obj, null, 3)
    .replace(/&/g, "&amp;")
    .replace(/\\"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(jsonLine, replacer);
}

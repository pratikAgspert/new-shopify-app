import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const WordEditor = ({ onUpdate, content, isDisabled }) => {
  const quillRef = useRef(null);

  const handleChange = (content) => {
    onUpdate({ content: content });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      // [{ font: [] }],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    // 'font',
  ];

  return (
    <ReactQuill
      ref={quillRef}
      value={content}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      theme="snow"
      readOnly={isDisabled}
    />
  );
};

export default WordEditor;

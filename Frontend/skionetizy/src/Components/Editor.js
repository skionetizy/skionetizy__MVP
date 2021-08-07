import React, { useEffect, useRef, useState } from "react";
import {
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  SelectionState,
} from "draft-js";
import "draft-js/dist/Draft.css";

const dict = {
  were: "where",
  r: "are",
  u: "you",
  ur: "your",
  favorete: "favourite",
};

const textareaStyles = {
  minHeight: 200,
  border: "1px solid blue",
  borderRadius: 10,
  color: "whitesmoke",
  fontSize: 32,
  resize: "vertical",
};
const rawContent = {
  blocks: [
    {
      text: "# Welcome to Lorem Ipsum",
      type: "unstyled",
    },
    {
      text: "",
    },
    {
      text: `This is a para characters will delete the entire entity. Adding characters.
      were is your favorete food?`,
      type: "unstyled",
    },
    {
      text: "",
    },
    {
      text: "### Features will",
      type: "unstyled",
    },
    {
      text: "",
    },
    {
      text: "- Budget Friendly",
      type: "unstyled",
    },
    {
      text: "- Faster then ever",
      type: "unstyled",
    },
    {
      text: "- Rounded Glass Edges",
      type: "unstyled",
    },
  ],

  entityMap: {
    first: {
      type: "WRONG",
      mutability: "MUTABLE",
    },
  },
};

export default function MyEditor() {
  const [editing, setEditing] = useState("");
  const [currentBlock, setCurrentBlock] = useState("");
  const decorators = new CompositeDecorator([
    {
      strategy(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges((character) => {
          const entityKey = character.getEntity();
          return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === "WRONG"
          );
        }, callback);
      },
      component: TokenSpan,
    },
  ]);
  const [text, setText] = useState(() =>
    EditorState.createWithContent(convertFromRaw(rawContent), decorators)
  );
  const editorStateRef = useRef(text);

  return (
    <div style={textareaStyles}>
      <Editor
        editorState={text}
        onChange={(editorState) => {
          setText(editorState);
          editorStateRef.current = editorState;
          const blockKey = editorState.getSelection().getEndKey();
          setCurrentBlock(blockKey);
        }}
      />
    </div>
  );
}

function applyWrongEntity(editorState, textStart, textEnd) {
  console.count("applyWrongEntity()");
  // return if text is empty
  if (textStart === textEnd) return editorState;

  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity("WRONG", "MUTABLE");
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const newSelection = new SelectionState({
    anchorKey: selection.getAnchorKey(),
    anchorOffset: textStart,
    focusKey: selection.getAnchorKey(),
    focusOffset: textEnd,
  });

  const withAppliedEntity = Modifier.applyEntity(
    contentState,
    newSelection,
    entityKey
  );

  const withErrorDecoration = EditorState.push(
    editorState,
    withAppliedEntity,
    "apply-entity"
  );

  const withProperCursor = EditorState.forceSelection(
    withErrorDecoration,
    selection
  );

  return withProperCursor;
}

function TokenSpan(props) {
  return (
    <span style={{ cursor: "pointer", borderBottom: "2px solid green" }}>
      {props.children}
    </span>
  );
}

const numbersAlphabets =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.";

function createAlphabets(str = "") {
  let text = "";
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (numbersAlphabets.includes(char)) {
      text += char;
    } else {
      text += " ";
    }
  }

  return text;
}

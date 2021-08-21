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
  ContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { NEW_useDebounceGeneral as useDebounce } from "../hooks/useDebounceGeneral";
import axios from "axios";

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
      text: `This is a para characters will delete the entire entity. Adding characters.\n were is your favorete food?`,
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
  const isEditing = useRef(false);

  const debounce = useDebounce(
    /** @type {EditorState} */ async (text) => {
      let finalEditorState = text;
      const cs = finalEditorState.getCurrentContent();
      isEditing.current = false;

      const prediction = (
        await axios.post("/api/Grammar-Check", {
          input: cs.getPlainText(),
        })
      ).data.prediction;
      if (isEditing.current === true) return;

      const predictionBlocks = prediction
        .split("\n")
        .map((para) => para.split(" "));

      cs.getBlocksAsArray().forEach((block, iBlock) => {
        let textOffset = 0;
        block
          .getText()
          .split(" ")
          .forEach((word, wordIdx) => {
            if (word != predictionBlocks[iBlock][wordIdx]) {
              finalEditorState = applyWrongEntity(
                finalEditorState,
                block.getKey(),
                textOffset,
                textOffset + word.length,
                {
                  correctText: predictionBlocks[iBlock][wordIdx],
                  setText,
                  debounceWithCS: (cs) => {
                    setText(EditorState.set(text, { currentContent: cs }));
                    debounce(EditorState.set(text, { currentContent: cs }));
                  },
                }
              );
            } else {
              finalEditorState = removeWrongEntity(
                finalEditorState,
                block.getKey(),
                textOffset,
                textOffset + word.length
              );
            }

            textOffset += word.length + 1;
          });
      });

      setText(finalEditorState);
    },
    2000
  );

  return (
    <div style={textareaStyles}>
      <Editor
        editorState={text}
        onChange={(editorState) => {
          setText(editorState);
          editorStateRef.current = editorState;
          isEditing.current = true;
          debounce(editorState);
        }}
      />
    </div>
  );
}

function applyWrongEntity(editorState, blockKey, textStart, textEnd, props) {
  console.count("applyWrongEntity()");
  // return if text is empty
  if (textStart === textEnd) return editorState;

  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity(
    "WRONG",
    "MUTABLE",
    props
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const newSelection = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: textStart,
    focusKey: blockKey,
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

function removeWrongEntity(editorState, blockKey, textStart, textEnd) {
  console.count("applyWrongEntity()");
  // return if text is empty
  if (textStart === textEnd) return editorState;

  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity("WRONG", "MUTABLE");
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const newSelection = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: textStart,
    focusKey: blockKey,
    focusOffset: textEnd,
  });

  const withAppliedEntity = Modifier.applyEntity(
    contentState,
    newSelection,
    null
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

function TokenSpan({
  children,
  entityKey,
  blockKey,
  contentState,
  start,
  end,
  ...props
}) {
  console.log(props);
  const { correctText, setText, debounceWithCS } = contentState
    .getEntity(entityKey)
    .getData();
  /** @type {ContentState} */
  let c = contentState;

  return (
    <span
      onClick={(ev) => {
        const cs = Modifier.replaceText(
          contentState,
          new SelectionState({
            anchorKey: blockKey,
            anchorOffset: start,
            focusKey: blockKey,
            focusOffset: end,
          }),
          correctText
        );

        debounceWithCS(cs);
      }}
      onMouseEnter={() => console.log(correctText)}
      style={{ cursor: "pointer", borderBottom: "2px solid green" }}
    >
      {children}
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

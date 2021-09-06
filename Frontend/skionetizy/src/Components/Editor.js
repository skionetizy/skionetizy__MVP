import axios from "axios";
import {
  CompositeDecorator,
  ContentState,
  convertFromRaw,
  Editor,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import React, { useEffect, useRef, useState } from "react";
import { NEW_useDebounceGeneral as useDebounce } from "../hooks/useDebounceGeneral";

export default function MyEditor({ onChange, className }) {
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
  const [text, setText] = useState(() => EditorState.createEmpty(decorators));
  const editorStateRef = useRef(text);
  const isEditing = useRef(false);
  const isInFocus = useRef(true);

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
      if (isInFocus.current === false) return;

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

  useEffect(() => {
    onChange?.(text.getCurrentContent().getPlainText());
  }, [text]);

  return (
    <div className={className}>
      <Editor
        editorState={text}
        onChange={(editorState) => {
          setText(editorState);
          editorStateRef.current = editorState;
          isEditing.current = true;
          debounce(editorState);
        }}
        onBlur={() => {
          isInFocus.current = false;
        }}
        onFocus={() => {
          isInFocus.current = true;
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

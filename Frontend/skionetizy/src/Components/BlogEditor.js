import axios from "axios";
import {
  CompositeDecorator,
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";
import { draftjsToMd, mdToDraftjs } from "draftjs-md-converter";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useEffect, useRef, useState } from "react";
import { NEW_useDebounceGeneral as useDebounce } from "../hooks/useDebounceGeneral";
import noop from "../utils/noop";
import { Editor } from "react-draft-wysiwyg";
const FormData = require("form-data");

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

function uploadImageCallBack(file) {
  return new Promise((resolve, reject) => {
    const rf = new FileReader();
    rf.readAsDataURL(file);
    rf.onloadend = async function (event) {
      const body = new FormData();
      body.append("image", event.target.result.split(",").pop());
      body.append("name", file.name.split(".")[0]);
      console.log(body);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?expiration=600&key=${process.env.REACT_APP_API_IMAGES}`,
        {
          method: "POST",
          body: body,
        }
      );
      const response = await res.json();
      console.log(response);
      resolve({ data: { link: response.data.image.url } });
    };
  });
}

export default function MyEditor({
  shouldLoadData,
  handleStopLoadData,
  onChange,
  onGrammarCheck = noop,
  className,
  initialDataprop
}) {
  // get initial data from localstorage, if any there.
  const initialData = !initialDataprop
    ? convertFromRaw(JSON.parse(window.localStorage.getItem("content")))
    : (initialDataprop);
  const [editorState, setEditorState] = useState(() => {
    initialData
      ? EditorState.createWithContent(initialData, decorators)
      : EditorState.createEmpty(decorators);
  });
  // for storing markdown for grammer API purposes
  const [text, setText] = useState(null);
  const isFirstRender = useRef(true);
  const editorStateRef = useRef(editorState);
  const isEditing = useRef(false);
  const isInFocus = useRef(true);

  const debounce = useDebounce(
    /** @type {EditorState} */ async (text) => {
      try {
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
                    setEditorState,
                    debounceWithCS: (cs) => {
                      setEditorState(
                        EditorState.set(text, { currentContent: cs })
                      );
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

        setEditorState(finalEditorState);
        onGrammarCheck(null, prediction);
      } catch (error) {
        onGrammarCheck(error, null);
      }
    },
    2000
  );

  useEffect(() => {
    if (!isFirstRender.current) {
      console.log(text);
      onChange?.(editorState.getCurrentContent());
    } else {
      isFirstRender.current = false;
    }
  }, [text]);

  useEffect(() => {
    //if (shouldLoadData === true) {
    isFirstRender.current = true;
    if(initialData){
      setEditorState(EditorState.createWithContent(initialData, decorators))
      setText(draftjsToMd(convertToRaw(initialData)))
    }
    else{
      EditorState.createEmpty(decorators);
    }

    handleStopLoadData();
    //}
  }, [shouldLoadData]);

  ///
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const content = editorState.getCurrentContent();
    if (content === null) {
      content = editorState.createEmpty();
    }
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );
    console.log(content);
    setText(draftjsToMd(convertToRaw(content)));
    onChange(content);
    editorStateRef.current = editorState;
    isEditing.current = true;
    debounce(editorState);
  };
  ///

  return (
    <div className={className}>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        onBlur={() => {
          isInFocus.current = false;
        }}
        onFocus={() => {
          isInFocus.current = true;
        }}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "list",
            "image",
            "history",
            "link",
            "emoji",
          ],
          blockType: { inDropdown: true },
          inline: { inDropdown: true, options: ["bold", "italic"] },
          list: { inDropdown: true, options: ["unordered", "ordered"] },
          link: { inDropdown: true },
          emoji: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            uploadCallback: uploadImageCallBack,
            fileUpload: true,
            url: true,
            alt: { present: true, mandatory: true },
          },
          history: { inDropdown: true },
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
  const { correctText, setEditorState, debounceWithCS } = contentState
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
      style={{ cursor: "pointer", borderBottom: "2px solid red" }}
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

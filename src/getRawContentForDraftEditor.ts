import { EditorState, ContentState, convertFromRaw } from 'draft-js';
// @ts-ignore
import htmlToDraft from 'html-to-draftjs';

export default (value: any): EditorState => {
  let rawContent: EditorState = EditorState.createEmpty();

  if (typeof value === "string" || !value) {
    try {
      rawContent = EditorState.createWithContent(JSON.parse(value));
    }
    catch (err) {
      try {
        const blocksFromHtml = htmlToDraft(value);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        rawContent = EditorState.createWithContent(contentState);
      } catch (err) {
        console.log(err);
      }
    }
  } else {
    if (value.blocks && value.entityMap) {
      rawContent = EditorState.createWithContent(convertFromRaw(value));
    } else {
      rawContent = value;
    }
  }

  return rawContent;
};

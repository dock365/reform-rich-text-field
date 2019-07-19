import * as React from 'react';
import { IFieldRenderProps } from '@dock365/reform';
import { IDraftEditorFieldState } from './IDraftEditorFieldState';

import { convertFromRaw, EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// @ts-ignore
import draftToHtml from 'draftjs-to-html';
import getRawContentForDraftEditor from '../getRawContentForDraftEditor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class DraftEditorField extends React.Component<IFieldRenderProps, IDraftEditorFieldState> {
  constructor(props: IFieldRenderProps) {
    super(props);

    this.state = {
      toolbarHidden: true,
      value: EditorState.createEmpty(),
    };

    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onEditorStateChange = this._onEditorStateChange.bind(this);
  }

  public componentDidMount() {
    if (this.props.value) {
      const rawContent: EditorState = getRawContentForDraftEditor(this.props.value);
      this.setState({
        value: rawContent,
      });
    }
  }

  public componentDidUpdate(prevProps: IFieldRenderProps) {
    if (this.props.value !== prevProps.value) {
      const rawContent: EditorState = getRawContentForDraftEditor(this.props.value);

      this.setState({
        value: rawContent || EditorState.createEmpty(),
      });
    }
  }

  public render() {
    const toolbar = {
      options: [
        'inline',
        'blockType',
        'fontSize',
        'fontFamily',
        'list',
        'textAlign',
        'colorPicker',
        'link',
        'emoji',
        'remove',
        'history',
      ],
    };

    return (
      <div className="draftEditorContainer">
        <label>{this.props.label}</label>
        <Editor
          editorState={this.state.value}
          toolbarClassName="draftEditorToolbarComponent"
          wrapperClassName="draftEditorWrapperComponent"
          editorClassName="draftEditorComponent"
          toolbar={toolbar}
          toolbarHidden={this.state.toolbarHidden}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          // toolbarOnFocus
          onEditorStateChange={this._onEditorStateChange}
        />

      </div>
    );
  }

  private _onFocus() {
    this.setState({ toolbarHidden: false });
  }

  private _onBlur() {
    this.setState({ toolbarHidden: true });
    if (this.props.onChange)
      this.props.onChange(draftToHtml(convertToRaw(this.state.value.getCurrentContent())));
  }

  private _onEditorStateChange(state: EditorState) {
    this.setState({ value: state });
  }
}

export default DraftEditorField;

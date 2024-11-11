import React, { Component } from "react";
import { GuestList } from "./GuestList";
import { AddGuest } from "./AddGuest";
import { GuestDetail } from "./GuestDetails";
import { saveFile, loadFile, listGuests } from "./server";
import { LoadCallback, SaveCallback, ListGuestsCallback} from "./server";
import { Guest } from "./guest";

// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

type Page = {kind: "list", loading: boolean} | {kind: "add", name: string, loading: boolean} | {kind: "detail", name: string, loading: boolean};

type WeddingAppState = {
  show: Page;
  currGuest: Guest | undefined;
  savedGuests: Array<Guest>;
};

// /** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      show: { kind: "list", loading: true },
      savedGuests: [],
      currGuest: undefined,
    };
  }

  render = (): JSX.Element => {
    if (this.state.show.loading) {
      return <div>Loading message here...</div>;
    } else if (this.state.show.kind === "list") {
      return (
        <GuestList
          initState={this.state.savedGuests}
          onCreateClick={this.doCreateClick}
          onFileClick={this.doFileClick}
        />
      );
    } else if(this.state.show.kind === "detail"){
      return this.state.currGuest ? (
        <GuestDetail
          guest={this.state.currGuest}
          name={this.state.show.name}
          onSave={this.doHandleSaveClick}
          onBack={this.doHandleBackClick}
        />
      ) : (
        <div>Loading message here...</div>
      );
    }
    else {
      return this.state.currGuest ? (
        <AddGuest
          initState={this.state.currGuest}
          name={this.state.show.name}
          onSave={this.doHandleSaveClick}
          onBack={this.doHandleBackClick}
        />
      ) : (
        <div>Loading message here...</div>
      );
    }
  };


  componentDidMount = (): void => {
    this.doHandleSaveDesignsResponse();
  };


  doHandleSaveDesignsResponse = (): void => {
    listGuests(this.doHandleGuestsResponse);
  };

  doHandleGuestsResponse: ListGuestsCallback = (guests: Array<Guest>): void => {
    this.setState({
        savedGuests: guests,
        show: { kind: "list", loading: false }
    });
    console.log('Guests loaded successfully.');
};

  doCreateClick = (name: string): void => {
    const guest: Guest = {kind: "individual", name: name, guestOf: "Molly", isFamily: false};
    this.setState({
      show: {kind: "add", name: name, loading: false},currGuest: guest});
  };


  doFileClick = (name: string): void => {
    this.setState({
      show: {kind: "detail", name: name, loading: true},
    });

    loadFile(name, this.doHandleFileClick);
  };

  doHandleFileClick: LoadCallback = (loadedName: string, guestObj: Guest | null): void => {
    if (guestObj) {
      this.setState({ currGuest: guestObj, show: { kind: "detail", name: loadedName, loading: false } });
    } else {
      this.setState({ show: { kind: "list", loading: true } });
    }
  };
  
  doHandleSaveClick = (name: string, guest: Guest): void => {
    saveFile(name, guest, this.doHandleSaveResponse);
    this.setState({ show: { kind: "list", loading: true } });
  };

  doHandleSaveResponse: SaveCallback = (name: string, saved: boolean): void => {
    if (saved) {
      this.doHandleSaveDesignsResponse();
      console.log('Name ' + name + ' saved successfully.');
    } else {
      this.setState({ show: { kind: "list", loading: true } });
      this.doHandleSaveDesignsResponse();
    }
  };

  doHandleBackClick = (): void => {
    this.setState({ show: { kind: "list", loading: true }, currGuest: undefined });
    this.doHandleSaveDesignsResponse();
  };
}
import React, { Component, MouseEvent } from "react";
import { List, nil, cons, compact_list } from "./list";
import { Guest, getGuestSumJames, getGuestSumMolly } from "./guest";

type PropsGuestList = {
  initState: Array<Guest>;
  onCreateClick: (name: string) => void;
  onFileClick: (guestName: string) => void;
};

type StateGuestList = {
  name: string;
  guests: Array<Guest>;
};

export class GuestList extends Component<PropsGuestList, StateGuestList> {
  constructor(props: PropsGuestList) {
    super(props);
    this.state = { name: "", guests: props.initState};
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h1>Guest List</h1>
        <ul>
          {compact_list(this.renderGuestLinks(this.state.guests))}
        </ul>
        <h3>Summary:</h3>
        <div>
          {getGuestSumJames(this.state.guests)}
        </div>
        <div>
          {getGuestSumMolly(this.state.guests)}
        </div>
        <button onClick={this.doMakeClick}>Add Guest</button>
      </div>
    );
  };

  renderGuestLinks = (guests: Array<Guest>): List<JSX.Element> => {
    if (guests.length === 0) {
      return nil;
    } else {
      const [guest, ...rest] = guests;
      const plusOneText = guest.hasGuest === true ? "+1" : guest.hasGuest === false ? "+0" : guest.hasGuest === undefined ? "+1?" : "Error";
      const familyName = guest.guestOf;
      const restLinks = this.renderGuestLinks(rest);

      const link = (
        <li key={guest.name}>
          <a href="#" onClick={(evt) => this.doGuestClick(evt, guest.name)}>
            {guest.name}
          </a>
          {'\u00A0\u00A0'} Guest of {familyName} {'\u00A0\u00A0'} {plusOneText}
        </li>
      );

      return cons(link, restLinks);
    }
  };

  doMakeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onCreateClick(this.state.name);
  };

  doGuestClick = (evt: MouseEvent<HTMLAnchorElement>, guestName: string): void => {
    evt.preventDefault();
    this.props.onFileClick(guestName);
  };
}
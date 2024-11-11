import React, { ChangeEvent, Component} from 'react';
import { Guest, replace, GuestType, toGuest } from './guest';


type PropsAddGuest = {
  initState: Guest;
  name:string;
  onSave: (name: string, guest: Guest) => void;
  onBack: () => void;
};

type StateAddGuest = {
  name: string;
  family: boolean;
  guest: Guest;
  guestOf: GuestType | undefined;
  error?: string;
};

export class AddGuest extends Component<PropsAddGuest, StateAddGuest> {
  constructor(props: PropsAddGuest) {
    super(props);
    this.state = {
      family: false,
      guestOf: undefined,
      guest: props.initState,
      name: "",
    };
  }
  
  render = (): JSX.Element => {

    return (
      <div>
        <h2>Add Guest</h2>
        {this.state.error && (<> <p style={{ color: 'red' }}>{this.state.error}</p></>)}
        <div>
          <label htmlFor="name">Name: </label>
          <input type="text" id="name" value={this.state.name} onChange={this.doHandleNameChange} />
        </div>
        <div>
        <p>Guest of:</p>
        <div>
          <label>
            <input
              type="radio"
              name="guestOf"
              value="Molly"
              onChange={this.doHandleGuestChange}
            />
            Molly
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="guestOf"
              value="James"
              onChange={this.doHandleGuestChange}
            />
            James
          </label>
        </div>
        </div>
        <div>
          <label htmlFor="isFamily">
            <input type="checkbox" id="isFamily" onChange={this.doHandleFamilyChange} />
            Family?
          </label>
        </div>
        <div>
          <button onClick={this.doHandleSubmitClick}>Add</button>
          <button onClick={this.doHandleBackClick}>Back</button>
        </div>
      </div>
    );
  };

  doHandleNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ name: evt.target.value });
};

doHandleFamilyChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.checked) {
      this.setState({ family: true });
    } else {
      this.setState({ family: false });
    }
};

doHandleGuestChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if(e.target.value === 'Molly') {
    this.setState({ guestOf: toGuest(e.target.value)});
    } else if (e.target.value === 'James'){
      this.setState({ guestOf: toGuest(e.target.value)});
    } else {

    }
};


doHandleSubmitClick = (): void => {

    if (!this.state.name) {
      this.setState({ error: 'Name is required' });
      return;
    }
    if (!this.state.guestOf) {
      this.setState({ error: 'Guest of is required' });
      return;
    }
    const newGuest = replace('individual', this.state.name, this.state.guestOf, this.state.family, "", undefined, "", "");

    this.setState({ error: undefined });
    this.props.onSave(this.state.name, newGuest);
};

doHandleBackClick = (): void => {
    this.props.onBack();
};
}
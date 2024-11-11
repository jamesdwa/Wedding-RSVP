import React from 'react';
import { Guest, replace } from './guest';
import { Component, ChangeEvent} from 'react';

type PropsGuestDetail = {
  name: string;
  guest: Guest;
  onSave: (name: string, guest: Guest) => void;
  onBack: () => void;
};

type StateGuestDetail = {
  name: string;
  dietaryRestric: string;
  additGuestName: string;
  additGuestDiet: string;
  hasGuest?: boolean;
  guest: Guest;
  error?: string;
};

export class GuestDetail extends Component<PropsGuestDetail, StateGuestDetail> {
  constructor(props: PropsGuestDetail) {
    super(props);
    this.state = {name: props.guest.name,
      hasGuest: props.guest.hasGuest,
      dietaryRestric: props.guest.dietaryRestric ?? "",
      guest: props.guest,
      additGuestName: props.guest.additGuestName ?? "",
      additGuestDiet: props.guest.additGuestDiet ?? "",
    };
  }

  render = (): JSX.Element => {

    return (
      <div>
        <h2>Guest Details</h2>
        {this.state.error && (<> <p style={{ color: 'red' }}>{this.state.error}</p></>)}
        <p>
          {this.state.name}, guest of {this.props.guest.guestOf}, {this.props.guest.isFamily ? 'family' : 'not family'}
        </p>
        <div>
          <label htmlFor="dietaryRestric">Dietary Restrictions (specify "none" if none): </label>
          <input
            type="text"
            id="dietaryRestric"
            value={this.state.dietaryRestric}
            onChange={this.doDietaryChangeClick}
          />
        </div>
        <div>
          <label htmlFor="has-guest">Additional Guest?</label>
          <select 
          id="has-guest" 
          value={this.state.hasGuest === undefined ? 'Unknown' : this.state.hasGuest ? '1' : '0'} onChange={this.doChangeHasGuestClick}>
            <option value="Unknown">Unknown</option>
            <option value="0">0</option>
            <option value="1">1</option>
          </select>
        </div>
        {this.state.hasGuest === true && (
          <>
            <div>
              <label>Guest Name:</label>
              <input type="text" value={this.state.additGuestName} onChange={this.doChangeAdditionalGuestNameClick} required />
            </div>
            <div>
              <label>Guest Dietary Restrictions: (Specify "none" if none)</label>
              <input type="text" value={this.state.additGuestDiet} onChange={this.doChangeAdditionalGuestDietClick} required />
            </div>
          </>
        )}
        <div>
          <button onClick={this.doSubmitGuestDetailsClick}>Save</button>
          <button onClick={this.doGoBackClick}>Back</button>
        </div>
      </div>
    );
  };

  doDietaryChangeClick = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ dietaryRestric: e.target.value });
  };


  doChangeAdditionalGuestNameClick = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ additGuestName: e.target.value });
  }
  
  doChangeAdditionalGuestDietClick = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ additGuestDiet: e.target.value });
  }

  doChangeHasGuestClick = (e: ChangeEvent<HTMLSelectElement>): void => {
    if(e.target.value === 'Unknown') {
      const hasGuest = undefined;
      this.doUpdateHasGuestClick(hasGuest);
    } else {
      const hasGuest = e.target.value === '1';
      this.doUpdateHasGuestClick(hasGuest);
    }

  };

  doUpdateHasGuestClick = (hasGuestVal: boolean | undefined): void => {
    this.setState({ hasGuest: hasGuestVal });
  };

  doSubmitGuestDetailsClick = (): void => {
    if (this.state.dietaryRestric.trim() === "") {
      this.setState({ error:'Dietary restrictions are required, specify "none" if none'});
      return;
    }
    if(this.state.hasGuest === true) {
      if(this.state.additGuestName.trim() === "") {
        this.setState({ error: 'Additional guest name is required' });
        return;
      }
      if (this.state.additGuestDiet.trim() === "") {
        this.setState({ error: 'Dietary restrictions are required, specify "none" if none' });
        return;
      }
    }

    const newGuest = replace('individual', this.state.name, this.props.guest.guestOf, this.props.guest.isFamily, this.state.dietaryRestric, this.state.hasGuest, this.state.additGuestName, this.state.additGuestDiet);

    this.setState({ error: undefined });
    this.props.onSave(this.state.name, newGuest);
  };

  doGoBackClick = (): void => {
    this.props.onBack();
  };
}
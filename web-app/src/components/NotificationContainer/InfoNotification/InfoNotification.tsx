import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Button } from '../../UI/Button';

import { closeInfoNotification } from '../../../state/notification';

import { KEYS } from '../../../constants';

import { Dispatch } from '../../../state';
import { InfoNotificationProps } from './InfoNotification.types';

export const InfoNotification = ({message, close}: InfoNotificationProps) => {

	useEffect(() => {
    function keyListener(e: React.KeyboardEvent) {
      if (e.key === KEYS.escape) {
        close();
      }
    };

		document.addEventListener<any>("keydown", keyListener);

		return function cleanUp() {
			document.removeEventListener<any>("keydown", keyListener);
		}
	}, [close]);

 return (
		<div 
			id="info-notification"
			className="notification info-notification"
		>
			<p className="notification__title">{"FYI"}</p>
			<p className="notification__message">{message}</p>
			<Button 
				styleClass="btn-info-notification" 
				name={"Close"} 
				handleClick={() => close()}
				shouldFocusOnRender={true}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    close: () => dispatch(closeInfoNotification()),
  };
};

export const ConnectedInfoNotification = connect(
	null,
	mapDispatchToProps,
)(InfoNotification);

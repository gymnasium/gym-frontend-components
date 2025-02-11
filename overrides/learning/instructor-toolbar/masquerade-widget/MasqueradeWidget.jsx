import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Dropdown } from '@openedx/paragon';

import { UserMessagesContext } from '@src/generic/user-messages';

import MasqueradeUserNameInput from '@src/instructor-toolbar/masquerade-widget/MasqueradeUserNameInput';
import MasqueradeWidgetOption from '@src/instructor-toolbar/masquerade-widget/MasqueradeWidgetOption';
import {
  getMasqueradeOptions,
  postMasqueradeOptions,
} from '@src/instructor-toolbar/masquerade-widget/data/api';
import messages from '@src/instructor-toolbar/masquerade-widget/messages';

class MasqueradeWidget extends Component {
  constructor(props) {
    super(props);
    this.courseId = props.courseId;
    this.state = {
      autoFocus: false,
      masquerade: 'Staff',
      active: {},
      available: [],
      shouldShowUserNameInput: false,
      masqueradeUsername: null,
    };
  }

  componentDidMount() {
    getMasqueradeOptions(this.courseId).then((data) => {
      if (data.success) {
        this.onSuccess(data);
      } else {
        // This was explicitly denied by the backend;
        // assume it's disabled/unavailable.
        // eslint-disable-next-line no-console
        this.onError('Unable to get masquerade options');
      }
    }).catch((response) => {
      // There's not much we can do to recover;
      // if we can't fetch masquerade options,
      // assume it's disabled/unavailable.
      // eslint-disable-next-line no-console
      console.error('Unable to get masquerade options', response);
    });
  }

  onError(message) {
    this.props.onError(message);
  }

  async onSubmit(payload) {
    this.clearError();
    const options = await postMasqueradeOptions(this.courseId, payload);
    return options;
  }

  onSuccess(data) {
    const { active, available } = this.parseAvailableOptions(data);
    this.setState({
      active,
      available,
    });
  }

  getOptions() {
    const options = this.state.available.map((group) => (
      <MasqueradeWidgetOption
        groupId={group.groupId}
        groupName={group.name}
        key={group.name}
        role={group.role}
        selected={this.state.active}
        userName={group.userName}
        userPartitionId={group.userPartitionId}
        userNameInputToggle={(...args) => this.toggle(...args)}
        onSubmit={(payload) => this.onSubmit(payload)}
      />
    ));
    return options;
  }

  clearError() {
    this.props.onError('');
  }

  toggle(show, groupId, groupName, role, userName, userPartitionId) {
    this.setState(prevState => ({
      autoFocus: true,
      masquerade: groupName,
      shouldShowUserNameInput: show === undefined ? !prevState.shouldShowUserNameInput : show,
      active: {
        ...prevState.active, groupId, role, userName, userPartitionId,
      },
    }));
  }

  parseAvailableOptions(postData) {
    const data = postData || {};
    const active = data.active || {};
    const available = data.available || [];
    if (active.userName) {
      this.setState({
        autoFocus: false,
        masquerade: 'Specific Student...',
        masqueradeUsername: active.userName,
        shouldShowUserNameInput: true,
      });
    } else if (active.groupName) {
      this.setState({ masquerade: active.groupName });
    } else if (active.role === 'student') {
      this.setState({ masquerade: 'Learner' });
    }
    return { active, available };
  }

  render() {
    const {
      autoFocus,
      masquerade,
      shouldShowUserNameInput,
      masqueradeUsername,
    } = this.state;
    const specificLearnerInputText = this.props.intl.formatMessage(messages.placeholder);
    return (
      <div className="flex-grow-1">
        <div className="row">
          <span className="col-auto col-form-label pl-3">View this course as:</span>
          <Dropdown className="flex-shrink-1 mx-1">
            <Dropdown.Toggle id="masquerade-widget-toggle" variant="inverse-outline-primary">
              {masquerade}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {this.getOptions()}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        {shouldShowUserNameInput && (
          <div className="row mt-2">
            <span className="col-auto col-form-label pl-3" id="masquerade-search-label">{`${specificLearnerInputText}:`}</span>
            <MasqueradeUserNameInput
              id="masquerade-search"
              className="col-4"
              autoFocus={autoFocus}
              defaultValue={masqueradeUsername}
              onError={(errorMessage) => this.onError(errorMessage)}
              onSubmit={(payload) => this.onSubmit(payload)}
            />
          </div>
        )}
      </div>
    );
  }
}
MasqueradeWidget.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  onError: PropTypes.func.isRequired,
};
MasqueradeWidget.contextType = UserMessagesContext;
export default injectIntl(MasqueradeWidget);

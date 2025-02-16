// Copyright 2018-2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

/* global $, i18n */

$(document).on('keydown', e => {
  if (e.keyCode === 27) {
    window.closePermissionsPopup();
  }
});

const $body = $(document.body);

async function applyTheme() {
  const theme = await window.Settings.themeSetting.getValue();
  $body.removeClass('light-theme');
  $body.removeClass('dark-theme');
  $body.addClass(`${theme === 'system' ? window.systemTheme : theme}-theme`);
}

applyTheme();

window.SignalContext.nativeThemeListener.subscribe(() => {
  applyTheme();
});

let message;
if (window.forCalling) {
  if (window.forCamera) {
    message = i18n('videoCallingPermissionNeeded');
  } else {
    message = i18n('audioCallingPermissionNeeded');
  }
} else {
  message = i18n('audioPermissionNeeded');
}

window.showConfirmationDialog({
  confirmStyle: 'affirmative',
  message,
  okText: i18n('allowAccess'),
  resolve: () => {
    if (!window.forCamera) {
      window.Settings.mediaPermissions.setValue(true);
    } else {
      window.Settings.mediaCameraPermissions.setValue(true);
    }
    window.closePermissionsPopup();
  },
  reject: window.closePermissionsPopup,
});

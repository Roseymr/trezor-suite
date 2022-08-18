import React from 'react';
import { Translation, TroubleshootingTips } from '@suite-components';

const DeviceDisconnectRequired = () => (
    <TroubleshootingTips
        label={<Translation id="TR_DISCONNECT_YOUR_DEVICE" />}
        items={[
            {
                key: 'disconnect-your-device',
                heading: <Translation id="TR_DISCONNECT_YOUR_DEVICE" />,
                description: <Translation id="DISCONNECT_DEVICE_DESCRIPTION" />,
            },
        ]}
    />
);

export default DeviceDisconnectRequired;

import React from 'react';
import { Icon as NBIcon } from 'native-base';

import theme from '../../../native-base-theme/variables/commonColor';

const IONI = 'Ionicons';
const MCI = 'MaterialCommunityIcons';
const FA = 'FontAwesome';

const iconList = {
  'feed': { name: 'logo-rss', type: IONI },
  'search': { name: 'search', type: IONI },
  'heart': { name: 'heart', type: IONI },
  'chat': { name: 'chatbubbles', type: IONI },
  'profile': { name: 'person', type: IONI },
  'photos': { name: 'photos', type: IONI },
  'block': { name: 'close-circle', type: IONI },
  'report': { name: 'flag', type: IONI }
};


export default Icon = (props) => {
  let icon = iconList[props.name];
  icon = icon ? icon : { name: props.name, type: IONI };
  return (
    <NBIcon
      {...props}
      style={[{ color: theme.iconStyle }, props.style]}
      name={icon.name}
      type={icon.type}
    />
  )
};





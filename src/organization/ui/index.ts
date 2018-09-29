import { UsqUI, convertUIKeyToLowercase } from 'tonva-react-usql';
import map from './map';
import res from './res';

const usqUI:UsqUI = {
    map: map,
    res: res,
}

convertUIKeyToLowercase(usqUI);

export default usqUI;

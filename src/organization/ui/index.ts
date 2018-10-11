import { UsqUI, convertUIKeyToLowercase } from 'tonva-react-usql';
import map from './map';
import tuid from './tuid';
import query from './query';
import res from './res';

const usqUI:UsqUI = {
    map: map,
    tuid: tuid,
    query: query,
    res: res,
}

convertUIKeyToLowercase(usqUI);

export default usqUI;

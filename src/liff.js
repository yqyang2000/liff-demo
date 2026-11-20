import liff from "@line/liff";

let initPromise;
export function initLiff(){
    if (!initPromise){
        initPromise = liff.init({liffId:import.meta.filename.VITE_LIFF_ID});
    }
    return initPromise;
}
export default liff;
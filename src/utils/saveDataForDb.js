import store from '../store/store';
const {getters} = store
const {getCode} = getters
console.log(999, getters, getCode)

let saveDataForDb = (data) => {
    console.log(1111, data);
    const {attributes, css, htmlTag} = data
    const {attr, value} = htmlTag
    console.log(0, value, css, attributes);
    // function getDbCode() {
        console.log(1111, store.getters.getCode()('tagNames', attr));
    // }

};

export default saveDataForDb
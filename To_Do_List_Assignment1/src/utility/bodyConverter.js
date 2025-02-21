const convertTOLower = (obj) => {
    const convertingObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            convertingObj[key.toLowerCase()] = obj[key];
        }
    }
    return convertingObj;
};

module.exports=convertTOLower;
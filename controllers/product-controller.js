const dateTime = require('node-datetime')

const makeDate = () => {
    const dt = dateTime.create()
    const formatted = dt.format('d-n-Y-I-M-S-N')
    return formatted
}

const formatProductName = (name) => {
    if (name.includes(" ")) {
        const arr = name.split(' ')
        var new_arr = []
        var formatted = ''
        arr.forEach((part) => {
            new_arr.push(part.replace(/[^a-z0-9]/gi,''))
        })
        new_arr.forEach((part) => {
            formatted = formatted + '-' + part
        })
        formatted = formatted.toUpperCase()
        return formatted.slice(1)
    } else {
        return name.toUpperCase()
    }
}

const getExt = (fileName) => {
    const arr = fileName.split('.')
    return arr[arr.length -1]
}

const cloudinaryOptions = {
    cloud_name: 'e-basket',
    api_key: '289166672125657',
    api_secret: 'Z1pR0jtr-B-eO8yu2Wb7qK7agNc'
}

module.exports = {
    makeDate: makeDate,
    formatProductName: formatProductName,
    getExt: getExt,
    cloudinaryOptions: cloudinaryOptions
}
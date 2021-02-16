const Item = require('../models/item');

// Get all items in the database and render them on the home page
const getAllItems = async (callback) => {
    const item = await Item.find().lean();
    return item;
}
// Sort the database items in a specific order
const sortByEnrolls = async () => {
    const items = await getAllItems();
    return items
        .sort((a, b) => a.usersEnrolled.length - b.usersEnrolled.length);
}

// Sort the database items by date (if needed)
// const sortByDate = async () => {
//     const items = await getAllItems();
//     return items
//         .filter(x => x.isPublic === true)
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
// }

module.exports = {
    getAllItems,
    sortByEnrolls,
    // sortByDate,
}
const Child = require('../schema/childSchema.js'); // Import the User model from UserSchema.js

// Function to create a user within DB
exports.createChild = async function createChild(fdata) {
  try {
    // Extract the relevant data from fdata
    const { FirstName, LastName, Grade, ParentId } = fdata;

    // Create a new User instance with the extracted user data
    const newChild = new Child({
      firstName: FirstName,
      lastName: LastName,
      grade: Grade,
      parentId: ParentId,
    });

    // Save the user to the database
    await newChild.save();

    return newChild;
  } catch (error) {
    // Log the error and throw an exception
    console.error('Error creating user:', error);
    throw error;
  }
};

exports.getChildrenByParentId = async function getChildrenByParentId(parentId) {
  try {
    const children = await Child.find({ parentId: parentId });
    return children;
  } catch (error) {
    console.error('Error getting children:', error);
    throw error;
  }
};

// Function to update child first name, last name or grade
exports.updateChild = async function updateChild(fdata) {
  try {
    const existingChild = await Child.findById(fdata._id);
    if (!existingChild) {
      throw new Error('Child not found with the specified _id');
    } else {
      existingChild.firstName = fdata.FirstName;
      existingChild.lastName = fdata.LastName;
      existingChild.grade = fdata.Grade;
    }

    // Update the existing document with the new data
    const editChild = await existingChild.save();
    return editChild;
  } catch (error) {
    console.log('Error updating child:', error);
    throw error;
  }
};

// Function to delete a child
exports.deleteChild = async function deleteChild(childId) {
  try {
    const child = await Child.findByIdAndDelete(childId);
  } catch (error) {
    console.log('Error deleting child:', error);
    throw error;
  }
};

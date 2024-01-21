const Child = require('../schema/childSchema.js'); // Import the User model from UserSchema.js
const WorkPackage2 = require('../schema/workPackage.js');
const Package = require('../schema/packageSchema.js');

// Function to create a user within DB
exports.createChild = async function createChild(fdata) {
  try {
    // Extract the relevant data from fdata
    const { FirstName, LastName, Grade, PassingGrade, ParentId, Preferences } = fdata;

    // Create a new User instance with the extracted user data
    const newChild = new Child({
      firstName: FirstName,
      lastName: LastName,
      grade: Grade,
      passingGrade: PassingGrade,
      parentId: ParentId,
      preferences: Preferences,
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
      existingChild.preferences = fdata.Preferences;
      existingChild.passingGrade = fdata.PassingGrade;
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

// Function to add/update child passing grade requirement per subject
exports.updateUserSubjectsPassingGrade = async function updateUserSubjectsPassingGrade(userId, subjects) {
  try {
    const existingUser = await Child.findById(userId);
    if (!existingUser) {
      throw new Error('User not found with the specified _id');
    } else {
      // Initialize the subjectPassingGrades field if it doesn't exist
      if (!existingUser.subjectPassingGrades) {
        existingUser.subjectPassingGrades = [];
      }
      existingUser.subjectPassingGrades = subjects; // Update the subjects field
    }
    const updatedUser = await existingUser.save();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user subjects:', error);
    throw error;
  }
};

// Function to add/update child material assignment
exports.updateChildMaterial = async function updateChildMaterial(childId, materialId) {
  try {
    assignedMaterials = [];
    const existingChild = await Child.findById(childId);
    if (!existingChild) {
      throw new Error('Child not found with the specified _id');
    } else {
      if (existingChild.assignedMaterials) {
        existingChild.assignedMaterials = materialId;
      } else {
        existingChild.assignedMaterials = [materialId];
      }
    }
    // Update the existing document with the new data
    const editChild = await existingChild.save();
    return editChild;
  } catch (error) {
    console.log('Error updating child:', error);
    throw error;
  }
};

exports.getPreviousPassingGrades = async function getPreviousPassingGrades(childId) {
  try {
    const child = await Child.findById(childId);
    if (child) {
      const prevPassingGrades = child.subjectPassingGrades;
      return prevPassingGrades;
    } else {
      console.log('No child found');
    }
  } catch (err) {
    console.log('Error getting previous passing grades for child: ', err);
  }
};
    
exports.getWorkPackagesByChildId = async function getWorkPackagesByChildId(childId) {
  try {
    const child = await Child.findById(childId);
    if (child) {
      const workPackages = child.assignedMaterials;
      return workPackages;
    } else {
      console.log('No child found');
    }
  } catch (err) {
    console.log('Error getting work packages for child: ', err);
    throw err;
  }
};

exports.getPackageByPackageId = async function getPackageByPackageId(packageId) {
  try {
    if (!packageId) {
      return null;
      // throw new Error('Package not found with the specified _id');
    }
    const package = await Package.findById(packageId);
    const workPackage = await WorkPackage2.findById(package.workPackageID);  
    const packagesInfo = {
      package_id: package._id,
      name: workPackage.name,
      grade: workPackage.grade,
      workPackageDescription: workPackage.description,
      packageDescription: package.description,
      subcategory: package.subcategory,
      materials: package.materials,
      quizzes: package.quizzes,
    };
    return packagesInfo;
  } catch (err) {
    console.log('Error getting work packages by id: ', err);
    throw err;
  }
};  

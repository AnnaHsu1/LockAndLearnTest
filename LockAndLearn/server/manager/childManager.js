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
exports.updateUserSubjectsPassingGrade = async function updateUserSubjectsPassingGrade(
  userId,
  subjects,
  revealAnswers,
  revealAnswersPassing,
  revealExplanation,
  revealExplanationPassing
) {
  try {
    const existingUser = await Child.findById(userId);
    if (!existingUser) {
      throw new Error('User not found with the specified _id');
    } else {
      // Initialize the subjectPassingGrades field if it doesn't exist
      if (!existingUser.subjectPassingGrades) {
        existingUser.subjectPassingGrades = [];
      }
      // Initialize the revealAnswers field if it doesn't exist
      if (!existingUser.revealAnswers) {
        existingUser.revealAnswers = false;
      }
      // Initialize the revealAnswersPassing field if it doesn't exist
      if (!existingUser.revealAnswersPassing) {
        existingUser.revealAnswersPassing = false;
      }
      // Initialize the revealExplanation field if it doesn't exist
      if (!existingUser.revealExplanation) {
        existingUser.revealExplanation = false;
      }
      // Initialize the revealExplanationPassing field if it doesn't exist
      if (!existingUser.revealExplanationPassing) {
        existingUser.revealExplanationPassing = false;
      }
      // Update the fields with the new data
      existingUser.revealExplanation = revealExplanation; // Update the revealExplanation field'
      existingUser.revealExplanationPassing = revealExplanationPassing; // Update the revealExplanationPassing field
      existingUser.revealAnswers = revealAnswers; // Update the revealAnswers field
      existingUser.revealAnswersPassing = revealAnswersPassing; // Update the revealAnswersPassing field
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
    let packageIds = [];
    // Get the existing child document
    const existingChild = await Child.findById(childId);
    if (!existingChild) {
      throw new Error('Child not found with the specified _id');
    } else {
      // Get packageID(s) from workpackageID(s) and assign to assignedMaterials which is linked to child
      const promises = materialId.map(async (material) => {
        const packageId = await Package.find({ workPackageID: material }); // find packageID(s) from workpackageID
        // tmp fix for workpackage having 0 package
        if (packageId == '') {
          const wpId = 'wp' + material;
          packageIds.push(wpId);
        }
        packageId.forEach((this_packageId) => {
          packageIds.push(this_packageId._id);
        });
      });
      await Promise.all(promises);
      existingChild.assignedMaterials = packageIds;
    }
    // Update the existing document with the new data
    const editChild = await existingChild.save();
    return editChild;
  } catch (error) {
    console.log('Error updating child:', error);
    throw error;
  }
};

// Function to get subjectPassingGrades assigned to the child with childId
exports.getPreviousPassingGrades = async function getPreviousPassingGrades(childId) {
  try {
    const child = await Child.findById(childId);
    if (child) {
      const prevPassingGrades = child.subjectPassingGrades;
      const revealAnswer = child.revealAnswers || false;
      const revealAnswerPassing = child.revealAnswersPassing || false;
      const revealExplanation = child.revealExplanation || false;
      const revealExplanationPassing = child.revealExplanationPassing || false;
      return {prevPassingGrades, revealAnswer, revealAnswerPassing, revealExplanation, revealExplanationPassing};
    } else {
      console.log('No child found');
    }
  } catch (err) {
    console.log('Error getting previous passing grades for child: ', err);
  }
};

// Function to get all workPackageIDs assigned to the child with packageIDs
exports.getWorkPackagesByChildId = async function getWorkPackagesByChildId(childId) {
  try {
    const child = await Child.findById(childId);
    if (child) {
      const workPackagesID = [];
      const packages = child.assignedMaterials;
      const promises = packages.map(async (package) => {
        // if package has wp (length = 26), then it is a workpackageID
        if (package.length == 26) {
          // remove wp from package
          const workPackageID = package.substring(2);
          workPackagesID.push(workPackageID);
          return;
        }
        const workPackageID = await Package.findById(package);
        workPackagesID.push(workPackageID.workPackageID);
      });
      await Promise.all(promises);
      // check if workpackageid has duplicates
      const workPackages = [...new Set(workPackagesID)];
      return workPackages;
    } else {
      console.log('No child found');
    }
  } catch (err) {
    console.log('Error getting work packages for child: ', err);
    throw err;
  }
};

// Function to get all packagesInfo assigned to the child with packageId
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

// Function to get all packages from child with childId
exports.getPackagesByChildId = async function getPackagesByChildId(childId) {
  try {
    const child = await Child.findById(childId);
    if (child) {
      const packages = child.assignedMaterials;
      return packages;
    } else {
      console.log('No child found');
    }
  } catch (err) {
    console.log('Error getting packages for child: ', err);
    throw err;
  }
};

exports.getPreferences = async function getPreferences(childId) {
  try {
    const child = await Child.findById(childId);
    if (child) {
      const preferences = child.preferences;
      return preferences;
    } else {
      console.log('No child found');
    }
  } catch (error) {
    console.error('Error getting preferences:', error);
    throw error;
  }
};

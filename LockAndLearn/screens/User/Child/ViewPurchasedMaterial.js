import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { getItem } from '../../../components/AsyncStorage';
import { IoMdStar } from 'react-icons/io';

const ViewPurchasedMaterial = ({ route, navigation }) => {
  const [workPackages, setWorkPackages] = useState([]);
  const [userId, setUserId] = useState(''); // User ID

  // function to get all owned work packages from the user
  const fetchWorkPackages = async (displayOwned = false) => {
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;
    if (userId) {
      try {
        const response = await fetch(
          `https://lockandlearn.onrender.com/workPackages/fetchWorkpackagesParent/${userId}?displayOwned=${displayOwned}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setWorkPackages(data);
        } else {
          console.error('Error fetching workPackages');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    } else {
      console.log('No work package found');
    }
  };

  useEffect(() => {
    fetchWorkPackages(true);
    getUser();
  }, []);

  // function to handle the update of the work package with the rating
  const handleUpdateWorkPackage = async (workPackage, rating, comment) => {
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;
    const ratingItem = {
      user: userId,
      stars: rating,
      comment: comment,
    };
    if (userId) {
      try {
        const response = await fetch(
          'https://lockandlearn.onrender.com/workPackages/updateWorkPackage/' + workPackage._id,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: workPackage.name,
              grade: workPackage.grade,
              description: workPackage.description,
              price: workPackage.price,
              ratings: ratingItem,
            }),
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          console.log('Updated work package:', data);
          alert('Review submitted/Updated! Thank you!');
        } else {
          console.error('Error updating work package');
          console.log(response);
        }
      } catch (error) {
        console.error('Network error');
      }
    } else {
      console.log('No work package found');
    }
  };

  const getUser = async () => {
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;
    setUserId(userId);
  };

  // function to display the work package information
  const RenderWorkPackage = ({ workPackage }) => {
    const index = workPackage.ratings.user
      ? workPackage.ratings.findIndex((ratings) => ratings.user === userId)
      : -1;
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [rating, setRating] = useState(index !== -1 ? workPackage.ratings[index].stars : 0);
    const [comment, setComment] = useState(index !== -1 ? workPackage.ratings[index].comment : '');
    const [hover, setHover] = useState(null);

    const handleClick = () => {
      setIsReviewModalVisible(!isReviewModalVisible);
    };

    const RenderStarRatings = () => {
      return (
        <View style={{ flexDirection: 'row' }}>
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <View key={i}>
                <IoMdStar
                  style={styles.buttonStarRating}
                  size={30}
                  className="star"
                  color={ratingValue <= (hover || rating) ? '#4f85ff' : '#e4e5e9'}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(rating)}
                  onClick={() => setRating(ratingValue)} // Set the rating to the key when clicking the star
                />
              </View>
            );
          })}
        </View>
      );
    };

    // Function to determine the grade suffix
    const getGradeSuffix = (grade) => {
      if (grade >= 11 && grade <= 13) {
        return 'th';
      }

      const lastDigit = grade % 10;

      switch (lastDigit) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return (
      <View key={workPackage._id} style={styles.workPackageItemContainer}>
        <View style={{ width: '80%' }}>
          <Text style={styles.workPackageItem}>
            {workPackage.name} - {workPackage.grade}
            {getGradeSuffix(workPackage.grade)} grade -{' '}
            {workPackage.price && workPackage.price !== 0 ? `$${workPackage.price}` : 'Free'}
          </Text>
          <Text style={styles.workPackageItem}>{workPackage.description}</Text>
          <Button style={styles.buttonReview} onPress={handleClick} textColor="white">
            Leave a Review!
          </Button>
          {isReviewModalVisible ? (
            <View>
              <Text style={styles.textReview}>
                Let others know about your experience with this package
              </Text>
              <Text style={styles.textReview}>Star Rating</Text>
              <RenderStarRatings />

              <input
                id="commentField"
                height={500}
                type="text"
                placeholder="Enter your review here"
                defaultValue={comment}
              />
              <Button
                style={styles.buttonSubmit}
                textColor="white"
                onPress={() => {
                  handleUpdateWorkPackage(
                    workPackage,
                    rating,
                    document.getElementById('commentField').value
                  ) !== null
                    ? document.getElementById('commentField').value
                    : ' ';
                  setComment(document.getElementById('commentField').value);
                }}
              >
                Submit
              </Button>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>Owned Work Packages</Text>
        {/* Display all work packages */}
        <FlatList
          data={workPackages}
          renderItem={({ item }) => <RenderWorkPackage workPackage={item} />}
          keyExtractor={(item) => item._id}
          style={{ width: '100%', marginTop: '2%' }}
          contentContainerStyle={{ paddingHorizontal: '5%' }}
          ListEmptyComponent={() => (
            // Display when no work packages are found
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text>No owned work packages</Text>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  containerFile: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '5%',
  },
  selectFiles: {
    color: '#696969',
    fontSize: 35,
    fontWeight: '500',
    marginTop: '1%',
    textAlign: 'center',
  },
  workPackageItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    color: '#000000',
    borderColor: '#696969',
    borderWidth: 1,
    padding: 13,
    borderRadius: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.35,
    marginTop: '1%',
  },
  workPackageItem: {
    fontSize: 16,
    marginVertical: 10,
  },
  buttonReview: {
    backgroundColor: '#4f85ff',
    width: 'fit-content',
    alignSelf: 'flex-end',
    textColor: 'white',
  },
  textReview: {
    color: '#8D8D8D',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  buttonSubmit: {
    backgroundColor: '#4f85ff',
    width: 'fit-content',
    alignSelf: 'center',
    textColor: 'white',
    marginTop: '2%',
  },
  buttonStarRating: {
    transition: 'color 0.25s',
    cursor: 'pointer',
  },
});

export default ViewPurchasedMaterial;

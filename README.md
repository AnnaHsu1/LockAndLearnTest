# SOEN490
Lock & Learn - Concordia Capstone Project

# Stakeholder 
Dr. Ali Akgunduz

# Members
- Alice Chen (40176279)
- Anna Hsu (40178711)
- Costa Papadakos (26665691)
- Fatema Akther (40177866)
- Georgia Pitic (40175034)
- Hao Yi Liu (40174210)
- Julie Trinh (40175335)
- Leon Zhang (40175616)
- Ryan Kim (40175423)
- William Chong (40176360)

# Getting Started
## Prerequisites
**⚠️ Before proceeding, please ensure that you have the following:**
- Installed Docker on your machine
- Installed NPM
- Installed node.js
- Gained access to the project MongoDB database


## Installation

1. Open Docker Desktop
2. Clone the project 
```shell
git clone https://github.com/RIGNITE/LockAndLearn.git
```
2. Navigate to the project directory on the chosen IDE
```shell
cd LockAndLearn
```
3. Add .env file with appropriate values
4. Add all dependencies
```shell
npm install
```
5. Run Docker
```shell
docker-compose build
```
```shell
docker-compose up
```
6. Open web browser at localhost:19006

## Testing
Unit Tests using Jest  
<br>
To run the unit tests
```shell
npm test
```

For test coverage
```shell
npx jest --coverage
```


const currentObj = {
  name: 'Bahai',
  duration: 12,
  maxGroupSize: 25,
  difficulty: 'easy'
};

const newObj = Object.assign({ id: 1997 }, currentObj);
console.log(newObj);
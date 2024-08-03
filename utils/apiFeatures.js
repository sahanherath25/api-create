class APIFeatures {

  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }


  filter() {

    const queryObject = { ...this.queryString };
    // queryObject==== { limit: '5', sort: '-ratingAverage,price' }
    // console.log("Query PAram ",queryObject);
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((item) => {
      return delete queryObject[item];
    });

    // TODO Advanced Filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    JSON.parse(queryStr);
    // this.query = Tour.find(JSON.parse(queryString));
    this.query=this.query.find(JSON.parse(queryStr));
    // console.log("Filtering",queryStr);
    return this;
  }

  sort(){

    if (this.query.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query=this.query.sort(sortBy);
    } else {
      //  If there is no sort parameter
      this.query = this.query.sort('-createdAt');
    }

    return this

  }

  limitFields(){

    console.log(this.queryString.fields);

    if (this.queryString.fields) {
      const sortByFields = this.queryString.fields.split(',').join('');
      console.log('Fields ', sortByFields);

      //TODO To do that here MongoDB expect string like ' name duration difficulty price '
      this.query = this.query.select(sortByFields);
    } else {
      this.query =this.query.select('-_v');
    }

    return this;
  }

  paginate(){
    //
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 100;

    //Logic to get the page and limit
    const skip = (page - 1) * limit;

    //TODO page 2& limit=10

    //TODO 1-10 page 1 |11-20 page 2 |21-30 page 3
    this.query = this.query.skip(skip).limit(limit);

    // if (this.query.page) {
    //   //TODO return a promise with all the counts and execute query with results
    //   const numOfTours = await Tour.countDocuments();
    //
    //   if (skip >= numOfTours) {
    //     throw new Error('This page is not Exists');
    //   }
    // }

    return this;
  }

}

module.exports=APIFeatures
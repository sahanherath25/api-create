const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// validate:[validator.isAlpha,"Tour Name must   only String not Numbers"]

//TODO  Creating Tours Schema
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      unique: true,
      maxlength:[40,"Tour Name Must have less than or equal 40 Characters"],
      minlength:[10,"Tour Name should have least 10 Characters in the Name"],
    },

    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour must Have Duration']
      // select:false
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour Must have Group Size']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour Must Have Difficulty Level'],
      enum:{
        values:["easy","medium","difficult"],
        message:"Values should have either  easy medium or difficult CAnnot have other Values "
      }
    }
    ,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min:[1,"Ratings must be Above 1"],
      max:[5,"Ratings must be below 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A Tour must have a pricce']
    }
    , priceDiscount: {
      type:Number,
    validate:{
        validator:function(value) {
          return value< this.price
        },
      message:"Discount Price Should Be Less Than {VALUE}"
    }

    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Tour Mus Have A Summer Description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      required: [true, 'Tour Mus Have A Cover Image'],
      type: String
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});


//TODO Function will be executed before save() and create()

tourSchema.pre('save', function(next) {
  console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', function(next) {
  console.log("Will About to DSave Document After 1st Pre ");
  next();
});

//Executed after all the pre middlewares are excuted

tourSchema.post("save",function(doc,next){
  console.log("Document Finished",doc);
  next()
})


//TODO QUERY MIDDLEWARES
tourSchema.pre('find', function(next) {
  this.find({secretTour:{$ne:true}})
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.find({secretTour:{$ne:true}})
  this.start=Date.now()
  next();
});


tourSchema.post(/^find/,function(docs,next){
  // console.log(`Query Took ${Date.now() - this.start} Seconds`);
  // console.log(docs);
  next()
})


//Aggregation middlewre

tourSchema.pre("aggregate",function(next){
  console.log("Before Execute Aggregate Happens");
   this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
  console.log("this ",this);
  next()
})




//TODO WE use Schema to define Models

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;


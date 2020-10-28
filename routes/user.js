const express = require('express');
const router = express.Router();
const { Submission } = require('../models');
let cache;
router.get('/', async (req, res) => {

  
  if(!cache || cache.time < Date.now()) {
    let data = await Submission.find();
    cache = {
      data,
      time: Date.now() + 300000,
    }
  };


  let response = cache.data.map((sub) => sub.toObject());
  let thisMonth = req.query.month || new Date().getMonth();
  let thisYear = req.query.year || new Date().getFullYear();
  let dateList = response
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ timestamp }) => ({
      year: new Date(timestamp).getFullYear(),
      month: new Date(timestamp).getMonth(),
      monthText:
        [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ][new Date(timestamp).getMonth()] +
        ' ' +
        new Date(timestamp).getFullYear(),
    }));
  dateList = [...new Set(dateList.map(JSON.stringify))].map(JSON.parse);
  let isDateExist = dateList.find(
    ({ year, month }) => year == thisYear && month == thisMonth
  );

  if (!isDateExist) {
    thisMonth = new Date().getMonth();
    thisYear = new Date().getFullYear();
  }
  let data = [];

  response

    .filter(({ timestamp }) => {
      if (+req.query.month && +req.query.year) {
        let before = +new Date(`${thisYear}-${+thisMonth + 1}-1`);
        let after = +new Date(`${thisYear}-${+thisMonth + 2}-1`);
        return timestamp < after && timestamp > before;
      } else {
        return true;
      }
    })
    
    .forEach((submission) => {
    let { name, discriminator, id, avatarUrl, ...submissionData } = submission;
    let indexInData = data.findIndex((item) => item.id === id);
    let isInData = indexInData > -1;

    if (isInData) {
      data[indexInData].submissions.push(submissionData);
    } else {
      data.push({
        id,
        name,
        discriminator,
        avatarUrl,
        submissions: [submissionData],
      });
    }
  });

  data = data.map((x) => {
    return {
      ...x,
      submissions: x.submissions.sort((a, b) => {
        let fa = a.url.toLowerCase(),
          fb = b.url.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      }),
    };
  });

  data = data.sort((a, b) => b.submissions.length - a.submissions.length);
  let filter = {
    thisMonth: +req.query.month ? thisMonth : 'all',
    thisYear: +req.query.year ? thisYear : 'all',
    dateList,
  };
  res.render('userList', { data, filter });
});

router.get('/:id', async (req, res) => {
  let userId = req.params.id;

  let response = await Submission.find({ id: +userId });

  if (!response.length) {
    res.render('404');
  } else {
    let data = {
      name: `${response[0].name}#${response[0].discriminator}`,
      avatarUrl: response[0].avatarUrl,
      articles: response,
    };
    res.render('user', data);
  }
});

module.exports = router;

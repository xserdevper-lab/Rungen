function generateResult(){

  const distance = document.getElementById('distance').value;
  const pace = document.getElementById('pace').value;
  const time = document.getElementById('time').value;
  const calories = document.getElementById('calories').value;
  const lang = document.getElementById('language').value;

  document.getElementById('showDistance').innerText = distance;
  document.getElementById('showPace').innerText = pace;
  document.getElementById('showTime').innerText = time;
  document.getElementById('showCalories').innerText = calories;

  // THAI

  if(lang === 'th'){

    document.getElementById('distanceText').innerText = 'กิโลเมตร';
    document.getElementById('paceText').innerText = 'เพซ';
    document.getElementById('timeText').innerText = 'เวลา';
    document.getElementById('caloriesText').innerText = 'แคลอรี่';

  }

  // ENGLISH

  if(lang === 'en'){

    document.getElementById('distanceText').innerText = 'Kilometers';
    document.getElementById('paceText').innerText = 'Avg Pace';
    document.getElementById('timeText').innerText = 'Time';
    document.getElementById('caloriesText').innerText = 'Calories';

  }

  // KOREAN

  if(lang === 'kr'){

    document.getElementById('distanceText').innerText = '킬로미터';
    document.getElementById('paceText').innerText = '평균 페이스';
    document.getElementById('timeText').innerText = '시간';
    document.getElementById('caloriesText').innerText = '칼로리';

  }

}

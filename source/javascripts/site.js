$(document).ready(function(){
  var question_json = $('#questions').data('json');

  $('#response').hide();
  $("#submit").click(function(){
    calculateScores();
    $('#response').show();
    $('#questions').hide();
  });
  $("#response button").click(function(){
    $('#myChart').html('');
    $('#response').hide();
    $('#questions').show();
  });

  var page_number = 1

  function togglePage(page_number){
    $('.pages').hide();
    $('#page-' + page_number).show();
  }

  $('.recommendation').hide();

  togglePage(page_number);

  $('button.next').click(function(){
    page_number++;
    togglePage(page_number);
    window.scrollTo(0, 0);
  })

  function calculateScores(){
    var scores = {};

    $.each(question_json.dimensions, function(){
      scores[this] = [];
    });

    $('fieldset input.scored-answer:checked').each(function(){
      var checked_input = $(this);
      var score = parseInt(checked_input.val());
      var dimension = checked_input.parents('fieldset').data('dimension');
      scores[dimension].push(score);
    });

    var averaged_dimensions = {};
    $.each(question_json.dimensions, function(){
      var final_scores = scores[this];
      if(!final_scores || final_scores.length == 0){
        averaged_dimensions[this] = 0;
      }else{
        averaged_dimensions[this] = math.mean(final_scores);
      }
    });
    console.log(averaged_dimensions);

    var scores = {};
    var winning_score = 9999999;
    var winner = null;

    $.each(question_json.organisation_types, function(index, organisation_type){
      var distance = 0;
      $.each(organisation_type.scores, function(key, value){
        distance += math.abs(value - averaged_dimensions[key])
      });
      scores[organisation_type.name] = distance
      if(distance < winning_score){
        winning_score = distance;
        winner = organisation_type.name
      }
    });
    console.log(scores);
    if(winner){
      $('.recommendation#'+winner).show();
    }

    $.each(question_json.dimensions, function(){
      var final_score = averaged_dimensions[this];
      var paragraph = $("#" + this + "_reflection");
      if (final_score < -1 ) {
        paragraph.html(question_json.reflections[this].low);
      } else if (final_score < 1 ) {
        paragraph.html(question_json.reflections[this].medium);
      } else {
        paragraph.html(question_json.reflections[this].high);
      }
    });



    var ctx = document.getElementById("myChart");
    var myRadarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(averaged_dimensions),
        datasets: [{
          data: Object.values(averaged_dimensions),
          label: 'Your results',
          backgroundColor: 'rgba(255, 99, 132, 0.2)'
        }]
      },
      options: {
        pointDot:false,
        scale: {
          ticks: {
            min: -3,
            max: 3,
            stepSize: 6,
            display: false
          }
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });

    window.scrollTo(0, 0);

  }

});

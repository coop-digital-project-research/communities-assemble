// This is where it all goes :)

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

    $('fieldset input:checked').each(function(){
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

    console.log(averaged_dimensions['control']);
    console.log(averaged_dimensions['growth']);
    console.log(averaged_dimensions['money']);
    console.log(averaged_dimensions['democracy']);

    if( (averaged_dimensions['control'] <= -2) &&
        (averaged_dimensions['growth'] >= -1) &&
        (averaged_dimensions['growth'] <= 1) &&
        (averaged_dimensions['money'] >= -1) &&
        (averaged_dimensions['money'] <= 1) &&
        (averaged_dimensions['democracy'] >= 2)
      ) {
      $('.recommendation#co-op').show();
    };

    if( (averaged_dimensions['control'] >= 1.5) &&
        (averaged_dimensions['growth'] >= 0) &&
        (averaged_dimensions['democracy'] <= -1) &&
        (averaged_dimensions['money'] >= 1)
      ) {
      $('.recommendation#ltd-by-shares').show();
    };

    if( (averaged_dimensions['control'] <= 1) &&
        (averaged_dimensions['growth'] <= -1) &&
        (averaged_dimensions['democracy'] >= 1) &&
        (averaged_dimensions['money'] <= -1)
      ) {
      $('.recommendation#charity').show();
    };

    if( (averaged_dimensions['control'] >= 1.5) &&
        (averaged_dimensions['growth'] >= 1.5) &&
        (averaged_dimensions['democracy'] >= 1.5) &&
        (averaged_dimensions['money'] >= 1.5)
      ) {
      $('.recommendation#cic').show();
    };

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
  }

});

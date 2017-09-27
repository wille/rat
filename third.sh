#!/bin/bash

function get {
    wget $2 --quiet -N -P "command/web/static/third/$1/"
}

get script "https://code.jquery.com/jquery-3.1.1.min.js"
get script "https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"
get script "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
get script "https://cdnjs.cloudflare.com/ajax/libs/split.js/1.2.0/split.min.js"
get script "https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min.js"
get script "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.8.0/bootstrap-slider.min.js"

get css "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"
get css "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.8.0/css/bootstrap-slider.min.css"
get css "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
get css "https://getbootstrap.com/2.3.2/assets/css/bootstrap-responsive.css"
get css "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"

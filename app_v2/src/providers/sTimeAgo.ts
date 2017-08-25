import { Injectable } from '@angular/core';

@Injectable()
export class sTimeAgo {

  constructor() {          
  }

  timeAgo(commentDate) {
    var d: Date = new Date(commentDate);
    var now: Date = new Date(Date.now());

    let seconds = Math.round(Math.abs((now.getTime() - d.getTime())/1000));

    // var subtraction = currentDate.getTime() - iCommentDate.getTime();
    // console.log('currentDate:' + currentDate);
    // console.log('iCommentDate:' + iCommentDate);
    // console.log('subtraction:' + subtraction);

		let minutes = Math.round(Math.abs(seconds / 60));
		let hours = Math.round(Math.abs(minutes / 60));
		let days = Math.round(Math.abs(hours / 24));
		let months = Math.round(Math.abs(days/30.416));
		let years = Math.round(Math.abs(days/365));
    
		if (seconds <= 45) {
			return '몇 초전';
		} else if (seconds <= 90) {
			return '1분 전';
		} else if (minutes <= 45) {
			return minutes + '분 전';
		} else if (minutes <= 90) {
			return '한 시간전';
		} else if (hours <= 22) {
			return hours + '시간 전';
		} else if (hours <= 36) {
			return '하루 전';
		} else if (days <= 25) {
			return days + '일 전';
		} else if (days <= 45) {
			return '한달 전';
		} else if (days <= 345) {
			return months + '개월 전';
		} else if (days <= 545) {
			return '1년 전';
		} else { // (days > 545)
			return years + '년 전';
		}
  }

}
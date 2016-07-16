(function () {
	'use strict';

	const PDF = require('../../dist/pdfcreator'),
		pdfDoc = new PDF(595.28, 841.89, 595.28 * 0.05, 'pt');

	// Add cover page
	pdfDoc.add('cover', {
		topImgUrl: 'logo1.png',
		title: 'Souq.com Page Likes Campaign',
		subTitle: '1st December 2015 - 3rd February 2016',
		subSubTitle: 'Page likes campaign with target: 15000',
		bottomImgUrl: 'logo2.png'
	});

	// Add new page
	pdfDoc.addPage({
		width: pdfDoc.width, 
		height: pdfDoc.height
	});
    
    // Insert page header
    pdfDoc.insertHeader({
    	text:'Socialbakers Export'
    });

    // Insert page footer
    pdfDoc.insertFooter({
    	text: 'Page 2/10',
    	align: 'center'
    });

    // Insert image with list
    pdfDoc.add('imgWithList', {
    	imgUrl: 'chart1.png',
    	titleColor: [247, 175, 48],
    	list: [
    		{
    			title: 'Total Fans',
    			subTitle: '232 k'
    		},
    		{
    			title: 'Total Change in Fans',
    			subTitle: '+ 17,1 k'
    		},
    		{
    			title: 'Max Change of Fans on',
    			subTitle: '+ 6,8 k'
    		}
    	]
    });

    // Insert full width image
    pdfDoc.add('fullWidthImg', {
    	imgUrl: 'map.jpg'
    });

    // Add new page
	pdfDoc.addPage({
		width: pdfDoc.width, 
		height: pdfDoc.height
	});
    
    // Insert page header
    pdfDoc.insertHeader({
    	text:'Socialbakers Export'
    });

    // Insert page footer
    pdfDoc.insertFooter({
    	text: 'Page 3/10',
    	align: 'center'
    });

    // Insert image with list
    pdfDoc.add('titleAndParagList', {
    	lineNumbers: true,
    	titleColor: [247, 175, 48],
    	list: [
			{
				title: 'Growth of Total Fans',
				parag: 'This graph shows the increase or decrease in fans during a selected time range.'
			},
			{
				title: 'Distribution of Fans',
				parag: 'Distribution of fans in different countries.'
			},
			{
				title: 'Number of Page Posts',
				parag: 'The sum of all posts posted by each Page'
			},
			{
				title: 'Distribution of Page Post Types',
				parag: 'This shows the breakdown of the posts according to the post type during a selected time range.'
			},
			{
				title: 'Number of Fan Posts',
				parag: 'The number of fan posts a page received during a selected time range.'
			},
			{
				title: 'Evolution of Interactions',
				parag: 'The daily sum of interactions from monitored social media profiles.'
			},
			{
				title: 'Distribution of Interactions',
				parag: 'The distribution of interactions (likes, comments, shares) during a selected time range.'
			},
			{
				title: 'Most Engaging Post Types',
				parag: 'This shows the average interactions per 1000 fans by post type during a selected time range.'
			},
			{
				title: 'User Activity',
				parag: 'This  graph  shows  the  total  number  of  all  user  posts  (user  posts,  questions  and  comments)  by  day  of  the  week  and  by  hour  of  the  day during a selected time range.'
			},
			{
				title: 'Number of Interactions per 1000 Fans',
				parag: 'Every post has the metric Number of interactions per 1000 fans that identifies how engaging the post is. It is the sum of interactions (likes, comments,  and  shares)  divided  by  the  number  of  fans  a  page  has  on  the  day  of  the  post  and  multiplied  by  1000.  The  daily,  weekly  and monthly values for this metric are then calculated as the sum of this metric for all posts made on a particular day, during a particular week or month.'
			},
			{
				title: 'Response Rate for User Questions',
				parag: 'This  graph  shows  the  percentage  and  the  number  of  user  questions  the  monitored  page  responded  to  versus  the  percentage  and  the number of user questions that did not receive a response during the selected time range. A user question is a user post on the company\'s page or a user post mentioning the company\'s page that contains a question mark in one of several possible languages (English, Armenian, Arabic, Japanese, and others). User questions that were either marked as spam, hidden, or deleted by the admin are not included.'
			},
			{
				title: 'Number of User Questions',
				parag: 'The total number of received questions during a selected time range.'
			},
			// {
			// 	title: 'Avg Response Time',
			// 	parag: 'The average time it took the monitored page to respond to a user post (or question) during a selected time range.'
			// },
			// {
			// 	title: 'Response Time Segments for User Questions',
			// 	parag: 'This  graph  shows  a  breakdown  of  the  time  it  took  the  monitored  page  to  respond  to  user  questions  during  a  selected  time  range.  The following  time  intervals  are  used:  under  10  minutes,  10-30  minutes,  30–60  minutes,  60–90  minutes,  90  minutes  -  2  hours,  2-4  hours,  4-6 hours, 6-12 hours, 12-24 hours, 24-48 hours, 48-72 hours, or more than 72 hours. A user question is a user post on the company\'s page or a user post mentioning the company\'s page that contains a question mark in one of several possible languages (English, Armenian, Arabic, Japanese, and others). User questions that were either marked as spam, hidden, or deleted by the admin are not included.'
			// }
		]
    });

	document.getElementById('save').onclick = pdfDoc.save.bind(pdfDoc, null);
})();
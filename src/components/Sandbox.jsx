import { useEffect, useState } from 'react';

function Sandbox() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [startDate, setStartDate] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [countdown, setCountdown] = useState('');
	const [examOver, setExamOver] = useState(false);
	const [formSubmitted, setFormSubmitted] = useState(
		localStorage.getItem('formSubmitted') || false
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
			let diffMs;
			if (currentTime < startDate) {
				diffMs = startDate.getTime() - currentTime.getTime();
			} else {
				diffMs = endTime.getTime() - currentTime.getTime();
				if (diffMs <= 0) {
					setExamOver(true);
					clearInterval(interval);
				}
			}
			const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
				.toString()
				.padStart(2, '0');
			const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
				.toString()
				.padStart(2, '0');
			const minutes = Math.floor((diffMs / (1000 * 60)) % 60)
				.toString()
				.padStart(2, '0');
			const seconds = Math.floor((diffMs / 1000) % 60)
				.toString()
				.padStart(2, '0');
			setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
		}, 1000);
		return () => clearInterval(interval);
	}, [currentTime, startDate, endTime]);

	useEffect(() => {
		localStorage.setItem('formSubmitted', formSubmitted);
	}, [formSubmitted]);

	function handleNewExam() {
		setFormSubmitted(false);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		const date = event.target.date.value;
		const startTime = event.target.startTime.value;
		const endTime = event.target.endTime.value;
		const [year, month, day] = date.split('-');
		const [startHours, startMinutes] = startTime.split(':');
		const [endHours, endMinutes] = endTime.split(':');
		const newStartDate = new Date(
			year,
			month - 1,
			day,
			startHours,
			startMinutes
		);
		const newEndTime = new Date(year, month - 1, day, endHours, endMinutes);
		setStartDate(newStartDate);
		setEndTime(newEndTime);
		setExamOver(false);
		setFormSubmitted(true);
		event.target.reset();
	};

	return (
		<div>
			{!formSubmitted && (
				<form onSubmit={handleSubmit}>
					<label>
						Date:
						<input type='date' name='date' required />
					</label>
					<label>
						Start Time:
						<input type='time' name='startTime' required />
					</label>
					<label>
						End Time:
						<input type='time' name='endTime' required />
					</label>
					<button type='submit'>Set Countdown</button>
				</form>
			)}
			{formSubmitted && (
				<>
					<p>Current Time: {currentTime.toLocaleString()}</p>
					<p>Start Time: {startDate.toLocaleString()}</p>
					<p>End Time: {endTime.toLocaleString()}</p>
					{countdown && !examOver && (
						<p>
							Time until {currentTime < startDate ? 'start time' : 'end time'}:{' '}
							{countdown}
						</p>
					)}
					{examOver && (
						<div>
							<p>The exam has ended.</p>
							<button onClick={handleNewExam}>New Exam</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Sandbox;

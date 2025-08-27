import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
	return (
		<footer className="text-zinc-400 mt-10 p-20 pb-5">
			<hr
				className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50"
			/>
			<div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
				{/* About */}
				<div>
					<h3 className="text-lg font-semibold mb-2 text-zinc-200">About</h3>
					<p className="text-sm">
						name is your personal game list. Track, rate, and explore your favorite titles with ease.
					</p>
				</div>

				{/* Navigation */}
				<div>
					<h3 className="text-lg font-semibold mb-2 text-zinc-200">Navigate</h3>
					<ul className="space-y-1 text-sm">
						<li><Link to="/" className="hover:underline">Home</Link></li>
						<li><Link to="/games" className="hover:underline">Discover</Link></li>
						<li><Link to="/list" className="hover:underline">My List</Link></li>						
						<li><Link to="/about" className="hover:underline">About</Link></li>
					</ul>
				</div>

				{/* Contact */}				
				<div>
					<h3 className="text-lg font-semibold mb-2 text-zinc-200">Contact me!</h3>
					<ul className="space-y-1 text-sm">
						<li>luccacheineck@gmail.com</li>
						<li className="flex items-center space-x-4 pt-3">
							<a href="https://github.com/LuccaHeineck" className="text-zinc-400 hover:text-zinc-100 transition-colors duration-200" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
								<FaGithub size={20} />
							</a>
							<a href="https://www.linkedin.com/in/lucca-heineck-7247a8288/" className="text-zinc-400 hover:text-zinc-100 transition-colors duration-200" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
								<FaLinkedin size={20} />
							</a>
						</li>
					</ul>
				</div>
			</div>

			<div className=" text-center text-sm py-4">
				Developed by Lucca Heineck
			</div>
		</footer>
	);
}

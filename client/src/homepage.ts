import $ from "jquery";
import { cookieExists, setCookie, getCookieValue, deleteCookie } from "cookies-utils";
import MarkdownIt from "markdown-it";
import { createHash } from "crypto";
import "./loadout";
import { getToken, setToken, setUsername } from "./states";
let mode = "normal"
console.log("homepage ts called")
export function setMode(md: string) {
	mode = md
}
export function getMode(): string {
	return mode
}

// ---- Game mode info + reusable info modal (GoKill) ----
type ModeKey = "normal" | "suroi_collab" | "dfbg-collab";
const MODE_INFO: Record<ModeKey, { label: string; available: boolean; desc: string }> = {
	"normal": {
		label: "Normal",
		available: true,
		desc: "The classic GoKill experience. Drop onto the island, scavenge weapons and healing, survive the shrinking safe zone and outlast every other player. Last survivor standing wins."
	},
	"suroi_collab": {
		label: "Suroi Collab",
		available: false,
		desc: "A crossover mode built with the Suroi community — new guns, reworked loot and a fresh take on the island. Still in the workshop."
	},
	"dfbg-collab": {
		label: "DownFall BG",
		available: false,
		desc: "DownFall BattleGround collab — a faster, harder ruleset for veterans who want a brutal fight to the last survivor. Landing on the island soon."
	}
};

interface ModalOptions {
	tag: string;
	soon?: boolean;
	title: string;
	desc: string;
	primary?: { label: string; onClick: () => void };
}

function showModal(opts: ModalOptions) {
	const modal = document.getElementById("gk-modal");
	if (!modal) return;
	const badge = document.getElementById("gk-modal-badge")!;
	badge.textContent = opts.tag;
	badge.className = "gk-modal__badge" + (opts.soon ? " soon" : "");
	document.getElementById("gk-modal-title")!.textContent = opts.title;
	document.getElementById("gk-modal-desc")!.textContent = opts.desc;
	const actions = document.getElementById("gk-modal-actions")!;
	actions.innerHTML = "";
	const btn = document.createElement("div");
	if (opts.primary) {
		btn.className = "gk-modal__apply";
		btn.textContent = opts.primary.label;
		btn.addEventListener("click", opts.primary.onClick);
	} else {
		btn.className = "gk-modal__apply disabled";
		btn.textContent = "Coming soon";
	}
	actions.appendChild(btn);
	modal.classList.remove("hidden");
}

function hideModal() {
	document.getElementById("gk-modal")?.classList.add("hidden");
}

(function initModeUI() {
	const modal = document.getElementById("gk-modal");
	document.getElementById("gk-modal-close")?.addEventListener("click", hideModal);
	modal?.addEventListener("click", e => { if (e.target === modal) hideModal(); });
	document.addEventListener("keydown", e => { if (e.key === "Escape") hideModal(); });

	const modeKeys: ModeKey[] = ["normal", "suroi_collab", "dfbg-collab"];
	const boxes = Array.from(document.querySelectorAll(".box-selectable .mode_box")) as HTMLElement[];
	boxes.forEach((box, i) => {
		const key = modeKeys[i];
		if (!key) return;
		if (key === "normal") box.classList.add("active");
		box.addEventListener("click", () => {
			const info = MODE_INFO[key];
			if (info.available) {
				showModal({
					tag: "GAME MODE",
					title: info.label,
					desc: info.desc,
					primary: {
						label: "Apply",
						onClick: () => {
							setMode(key);
							boxes.forEach(b => b.classList.remove("active"));
							box.classList.add("active");
							hideModal();
						}
					}
				});
			} else {
				showModal({ tag: "SOON", soon: true, title: info.label, desc: info.desc });
			}
		});
	});
})();
	$(document).ready(function () {
		$('.arrow').click(function () {
			$('.box-selectable').toggle();
			$(this).toggleClass('arrow-down');
		});
		$('.discord').click(function () {
			window.open('https://x.com/');
		});
		$('.info').click(function () {
			$('.info-box').toggle();
		});
		$('.close').click(function () {
			$('.info-box').hide();
		});
		$('.loadout').click(function () {
			showModal({
				tag: "SOON",
				soon: true,
				title: "Loadout & Shop",
				desc: "The Loadout is your survivor shop. Spend in-game currency you find scattered across the island to customize your character with new skins, cursors and healing items. Coming soon."
			});
		});
	});
if (!window.location.href!.includes("/loadout")) {
	window.onload = function () {
		document.getElementById('loading')!.classList.add('zoom-out');
		setTimeout(function () {
			document.getElementById('loading')!.style.display = 'none';
		}, 1000);
	};
	document.addEventListener('DOMContentLoaded', function () {
		var audio = <HTMLAudioElement>document.getElementById('menu-audio');
		var volumeIcon = <HTMLDivElement>document.getElementById('volume-icon');
		var volumeSlider = <HTMLDivElement>document.getElementById('volume-slider');
		var volumeRange = <HTMLInputElement>document.getElementById('volume-range');

		var started = false;
		if (!started) {
			audio.play();
			started = true;
		}

		// Initialise volume from the slider's default, and keep the slider visible inline.
		audio.volume = Number(volumeRange.value) / 100;
		volumeSlider.style.display = 'block';

		function syncMuteIcon() {
			volumeIcon.classList.toggle('muted', audio.muted || audio.volume === 0);
		}

		// Speaker icon = mute / unmute toggle.
		volumeIcon.addEventListener('click', function () {
			audio.muted = !audio.muted;
			syncMuteIcon();
		});

		volumeRange.addEventListener('input', function () {
			var volume = Number(volumeRange.value) / 100;
			audio.volume = volume;
			audio.muted = volume === 0;
			syncMuteIcon();
		});

		syncMuteIcon();
	});


	var accepted = -1;
	document.getElementById("button-accept")!.onclick = () => {
		showAds();
		accepted = 1;
		closeBox();
	}
	document.getElementById("button-decline")!.onclick = () => {
		hideAds();
		accepted = 0;
		closeBox();
	}
	document.getElementById("button-close")!.onclick = closeBox;
}
	function showAds() {
		document.querySelectorAll('.ads').forEach(ad => { (<HTMLElement>ad).style.visibility = "visible"; });
	}
	function hideAds() {
		const allElements = <HTMLCollectionOf<HTMLElement>>document.getElementsByTagName("*");
		for (let i = 0; i < allElements.length; i++) {
			if (allElements[i].tagName === "DIV" && allElements[i].hasAttribute("class") && allElements[i].getAttribute("class")!.includes("ads")) {
				allElements[i].style.display = "none";
			}
		}
	}
	function closeBox() {
		//document.getElementById("privacyBox").style.display = "none";
		document.querySelectorAll('.overlays').forEach(overlay => { (<HTMLElement>overlay).style.display = "none"; });
		//document.querySelectorAll('.boxers').forEach(boxer => { (<HTMLElement>boxer).style.display = "none"; });
		if (cookieExists("gave_me_cookies") && !cookieExists("ads"))
			setCookie({ name: "ads", value: accepted.toString() });
	}
	function setLoggedIn(username: string) {
		document.getElementById("account")!.innerHTML = `<h1>${username}</h1><h2 id="currency">Currency: 0</h2><div class="flex"><div class="button" id="button-logout">Log out</div></div>`;
		document.getElementById("button-logout")!.onclick = () => setLoggedOut(username);

		const input = <HTMLInputElement>document.getElementById("username");
		input.value = username;
		input.disabled = true;

		const token = cookieExists("gave_me_cookies") ? getCookieValue("access_token") : getToken();
		fetch("/api/currency", { headers: { "Authorization": "Bearer " + token } }).then(async res => {
			if (res.ok) document.getElementById("currency")!.innerHTML = `Currency: ${(await res.json()).currency}`;
		});
	}

	function setLoggedOut(username?: string) {
		document.getElementById("account")!.innerHTML = `
	<h1>Login / Sign up</h1>
	<input type="text" id="login_username" placeholder="Username..." ${username ? `value="${username}"` : ""} /><br>
	<input type="password" id="password" placeholder="Password..." /><br>
	<div class="flex">
		<div class="button" id="button-login">Login</div>
		<div class="button" id="button-signup">Sign up</div>
	</div>
	`;

		// Login and sign up buttons
		let loginWorking = false, signupWorking = false;
		document.getElementById("button-login")!.onclick = () => {
			if (loginWorking) return;
			loginWorking = true;
			const username = (<HTMLInputElement>document.getElementById("login_username")).value;
			const password = (<HTMLInputElement>document.getElementById("password")).value;
			if (!username || !password) return loginWorking = false;
			const hashed = createHash("sha1").update(password).digest("hex");
			fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password: hashed.slice(0, 16) }) })
				.then(async res => {
					if (res.ok) {
						if (cookieExists("gave_me_cookies")) {
							setCookie({ name: "username", value: username });
							setCookie({ name: "access_token", value: (await res.json()).accessToken });
						} else {
							setUsername(username);
							setToken((await res.json()).accessToken);
						}
						setLoggedIn(username);
					}
				})
				.finally(() => loginWorking = false);
		}

		document.getElementById("button-signup")!.onclick = () => {
			if (signupWorking) return;
			console.log("signing up");
			signupWorking = true;
			const username = (<HTMLInputElement>document.getElementById("login_username")).value;
			const password = (<HTMLInputElement>document.getElementById("password")).value;
			console.log(username, password);
			if (!username || !password) return signupWorking = false;
			const hashed = createHash("sha1").update(password).digest("hex");
			fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password: hashed.slice(0, 16) }) })
				.then(async res => {
					if (res.ok) {
						if (cookieExists("gave_me_cookies")) {
							setCookie({ name: "username", value: username });
							setCookie({ name: "access_token", value: (await res.json()).accessToken });
						} else {
							setUsername(username);
							setToken((await res.json()).accessToken);
						}
						setLoggedIn(username);
					}
				})
				.finally(() => signupWorking = false);
		}

		deleteCookie("access_token");
		setToken(undefined);

		const input = <HTMLInputElement>document.getElementById("username");
		input.value = "";
		input.disabled = false;
	}

	if (!cookieExists("gave_me_cookies")) {
		const button = document.getElementById("cookies-button")!;
		button.scrollIntoView();
		button.onclick = () => {
			setCookie({ name: "gave_me_cookies", value: "1" });
			button.classList.add("disabled");
			document.getElementById("cookies-span")!.innerHTML = "You gave me cookies :D";

			if (accepted >= 0)
				setCookie({ name: "ads", value: accepted.toString() });
		}

		setLoggedOut();
	} else {
		document.getElementById("cookies-button")!.classList.add("disabled");
		document.getElementById("cookies-span")!.innerHTML = "You gave me cookies :D";
		if (cookieExists("ads")) {
			const ads = getCookieValue("ads");
			if (ads == "1") showAds();
			else hideAds();
			closeBox();
		}

		checkLoggedIn();
	}

	// Live player count on the menu — polls the game server's /count endpoint.
	function refreshOnlineCount() {
		const el = document.getElementById("online-count");
		const addr = (<HTMLInputElement>document.getElementById("address"))?.value;
		if (!el || !addr) return;
		const proto = location.protocol === "https:" ? "https" : "http";
		fetch(`${proto}://${addr}/count`)
			.then(res => res.json())
			.then(data => { el.textContent = `${data.online} player${data.online === 1 ? "" : "s"} online`; })
			.catch(() => { el.textContent = "Server offline"; });
	}
	// Escape user-controlled usernames before injecting into the leaderboard markup.
	function escapeHtml(s: string): string {
		return s.replace(/[&<>"']/g, c => (<{ [k: string]: string }>{ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
	}
	// Survival leaderboard — polls the game server's /leaderboard endpoint.
	function refreshLeaderboard() {
		const el = document.getElementById("leaderboard");
		const addr = (<HTMLInputElement>document.getElementById("address"))?.value;
		if (!el || !addr) return;
		const proto = location.protocol === "https:" ? "https" : "http";
		fetch(`${proto}://${addr}/leaderboard`)
			.then(res => res.json())
			.then(data => {
				const list: { username: string; survivedMs: number; kills: number }[] = data.leaderboard || [];
				if (!list.length) { el.innerHTML = "<li>No survivors yet</li>"; return; }
				el.innerHTML = list.map(e => {
					const totalSec = Math.max(0, Math.floor(e.survivedMs / 1000));
					const m = Math.floor(totalSec / 60), s = totalSec % 60;
					const t = m > 0 ? `${m}m ${s}s` : `${s}s`;
					return `<li><span class="lb-name">${escapeHtml(e.username)}</span><span class="lb-time">${t} · ${e.kills} kill${e.kills === 1 ? "" : "s"}</span></li>`;
				}).join("");
			})
			.catch(() => { el.innerHTML = "<li>Server offline</li>"; });
	}
	if (!window.location.href!.includes("/loadout")) {
		refreshOnlineCount();
		refreshLeaderboard();
		setInterval(refreshOnlineCount, 5000);
		setInterval(refreshLeaderboard, 5000);
	}

	export function checkLoggedIn() {
		if (cookieExists("username")) {
			const username = getCookieValue("username")!;
			if (cookieExists("access_token")) {
				const accessToken = getCookieValue("access_token");
				fetch("/api/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, accessToken }) })
					.then(res => {
						if (res.ok) setLoggedIn(username);
						else setLoggedOut(username);
					});
			} else setLoggedOut(username);
		} else setLoggedOut();
	}

function tokenTalk(t_id) {
	let t = canvas.tokens.get(t_id);
	if (!t) return;
	let size = canvas.grid.size;
	let leftAdjust = 0;
	let topAdjust = 0
	if (t.id === $(`.talk-bubble`).attr('name')) return $(`.talk-bubble`).remove();
	$(`.talk-bubble`).remove();
	let $bubble = $(`<div class="talk-bubble" name="${t.id}" style="position: absolute; top: ${t.y+(t.h/2)-size-topAdjust}px; left: ${t.x+(t.w/2)+(size/4)+leftAdjust}px; display:inline;">
	<style>
	.talk-icon {
		color: var(--color-text-light-2);
		cursor: pointer;
		/*pointer-events: all;*/
		font-size: ${size}px;
		text-shadow: 0 0 8px #000000;
		opacity: .9;
	}
	</style>
	<span class="talk-icon"><i class="fas fa-comment"></i></span>
	</div>`);
	//if (!game.user.isGM) 
		//canvas.animatePan({x: t.data.x, y: t.data.y});
	$bubble.click(async function(){
		$(this).remove();
	});
	$(`#hud`).append($bubble);
}

let talksocket;

Hooks.once("socketlib.ready", () => {
	talksocket = socketlib.registerModule("token-talk");
	talksocket.register("TokenTalk", tokenTalk);
});

Hooks.once('init', () => {
	game.keybindings.register("token-talk", "showTalkBubble", {
		name: "Token Talk",
		hint: "Create Speach Bubble at Token",
		editable: [{key: "KeyB"}],
		onDown: () => {},
		onUp: () => {
				let t = canvas.tokens.controlled[0];
				if (canvas.tokens._hover?.isOwner) t = canvas.tokens._hover;
				if (!t) return $(`.talk-bubble`).remove();
				talksocket.executeForEveryone(tokenTalk, t.id);
			},      
		precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY
	});
});

Hooks.on('updateToken', (token)=>{
  $(`.talk-bubble[name="${token.id}"]`).remove();
});
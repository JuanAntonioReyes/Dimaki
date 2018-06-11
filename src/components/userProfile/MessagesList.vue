<template>
<div class="userMessages">
	<!-- Delete message modal -->
	<b-modal ref="deleteMessageModal" title="Delete this message?" size="sm" centered header-bg-variant="danger"
		header-text-variant="light" ok-variant="outline-danger" @ok="deleteMessage(selected.index)">

		<p class="text-center">
			ARE YOU SURE YOU WANT TO DELETE THIS MESSAGE?
		</p>

	</b-modal>
	<!-- / Delete message modal -->

	<b-row class="text-center">

		<b-col sm="12">

			<!-- MESSAGE DETAIL -->
			<b-alert dismissible :show="showMessageDetail" @dismissed="toggleMessageDetail">

				<div v-if="selected.index === -1">

					<!-- In theory this will never show, but just in case -->
					<div class="text-center">
						NO MESSAGE SELECTED
					</div>

				</div>
				<div v-else>

					<div>
						Message from you at coords:
					</div>
					{{ selected.message.location.coordinates[1].toFixed(6) }} /
					{{ selected.message.location.coordinates[0].toFixed(6) }}<br><br>

					<div class="text-center">
						{{ selected.message.text }}
					</div>

					<br>

					<div class="text-right">
						<strong @click="showModal()">DELETE MESSAGE</strong>
					</div>
				</div>
				
			</b-alert>
			<!-- /MESSAGE DETAIL -->

			<h4>YOUR MESSAGES</h4>

				<table id="userMessagesList" class="table table-hover">

				<thead class="thead-default">
					<tr>
						<th>Message</th>
						<th>Latitude</th>
						<th>Longitude</th>
					</tr>
				</thead>

				<tbody v-for="(message, messageIndex) in userMessages">

					<tr @click="toggleMessageDetail(messageIndex)">
						<td>
							{{ messageText(message) }}
						</td>
						<td>
							{{ message.location.coordinates[1].toFixed(6) }}
						</td>
						<td>
							{{ message.location.coordinates[0].toFixed(6) }}
						</td>
					</tr>

				</tbody>

			</table>
		</b-col>

	</b-row>
</div>
</template>

<script>
	import apiAccess from '../../js/apiAccess.js';

	export default {
		data() {
			return {

				userMessages: [],

				showMessageDetail: false,

				selected: {
					index: -1,
					message: null
				}

			}
		},

		async mounted() {
			this.getUserMessages();
		},

		methods: {

			showModal() {
				this.$refs.deleteMessageModal.show();
			},

			messageText(message) {
				if (message.text.length > 10) {
					return (message.text.substring(0, 10) + '...');
				}

				return message.text;
			},

			async getUserMessages(messageIndex) {
				var response = await apiAccess.fetchUserMessages();

				this.userMessages = response.data;
			},

			toggleMessageDetail(messageIndex) {
				// If the user clicks the dismiss button of the alert
				if (messageIndex === undefined) {
					messageIndex = this.selected.index;
				}

				if (this.selected.index !== -1) {
					// "Deselect" the message from the list (Change it background color)
					this.changeListMessageBackground(this.selected.index, '');
				}

				if (messageIndex !== this.selected.index) {
					this.selected.index = messageIndex;
					this.selected.message = this.userMessages[messageIndex];	

					// "Select" the message from the list (Change it background color)
					this.changeListMessageBackground(messageIndex, 'gray');

					// Show the message detail
					this.showMessageDetail = true;
				} else {
					this.selected.index = -1;
					this.selected.message = null;

					// Hide the message detail
					this.showMessageDetail = false;
				}
			},

			changeListMessageBackground(index, backgroundColor) {
				var messagesList = document.getElementById('userMessagesList').tBodies;
				var prevStyle = messagesList[index].style;

				prevStyle.background = backgroundColor;
			},

			deleteMessage(messageIndex) {
				var messageId = this.userMessages[messageIndex]._id;

				apiAccess.deleteMessage(messageId)
					.then((response) => {
						//this.$router.push({ name: 'userProfileLink' });
					})
					.catch((error) => {

						if (error.response.data.message === "jwt expired") {

							localStorage.removeItem("userToken");
							
							this.$emit('loginLogout', false);
							this.$router.push({ name: 'loginLink' });

						}

					});
			}

		}
	}
</script>

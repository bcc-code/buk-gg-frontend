<template>
    <div>
        <card v-if="player">
            <h5 slot="header" class="title">Edit Profile</h5>
            <div class="row">
                <div class="col-md-4 pr-md-1">
                    <base-input
                        :label="$t('registration.name')"
                        disabled
                        v-model="player.name"
                        type="name"
                        placeholder="Full Name"
                    >
                        <small slot="helperText" class="text-muted">{{
                            $t('registration.nameDescription')
                        }}</small>
                    </base-input>
                </div>
                <div class="col-md-4 pl-md-1">
                    <base-input
                        :label="$t('registration.email')"
                        type="email"
                        disabled
                        v-model="player.email"
                        placeholder="name@email.com"
                    >
                        <small slot="helperText" class="text-muted">{{
                            $t('registration.emailDescription')
                        }}</small>
                    </base-input>
                </div>
                <div class="col-md-4 pl-md-1">
                    <base-input
                        :label="$t('registration.location')"
                        disabled
                        v-model="player.location"
                        placeholder="Church or City"
                    >
                        <small slot="helperText" class="text-muted">{{
                            $t('registration.locationDescription')
                        }}</small>
                    </base-input>
                </div>
            </div>
            <br />
            <div class="row">
                <div class="col-md-6 pr-md-1">
                    <base-input
                        :label="$t('registration.nickname')"
                        v-model="player.nickname"
                        placeholder="Nickname"
                    >
                        <small slot="helperText" class="text-muted">{{
                            $t('registration.nicknameDescription')
                        }}</small>
                    </base-input>
                </div>
                <div class="col-md-6 pr-md-1">
                    <base-input
                        :label="$t('registration.phoneNumber')"
                        v-model="player.phoneNumber"
                        placeholder="Phone Number"
                    >
                        <small slot="helperText" class="text-muted">{{
                            $t('registration.phoneNumberDescription')
                        }}</small>
                    </base-input>
                </div>
            </div>

            <div slot="footer">
                <div class="">
                    <loading-button type="primary" :func="() => saveProfile()" :title="$t('common.save').toString().toUpperCase()"></loading-button>
                    
                    <base-button class="ml-2" type="danger" simple @click="$session.logout()">{{ $t('common.logoutButton').toString().toUpperCase() }}</base-button>
                    <!-- <base-checkbox @click="updatePrivacyPolicy()" v-model="player.agreeToPrivacyPolicy"><div v-html="$t('registration.agreeToTermsCheckbox')"></div></base-checkbox> -->
                </div>
            </div>
        </card>
        <base-alert dismissible v-if="failedSave" type="danger">{{
            $t('registration.mustAgreeToTerms')
        }}</base-alert>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import Discord from '../../services/discord';
import BaseAlert from '@/components/BaseAlert.vue';
import { LoadingButton } from '../../components';

@Component({
    components: {
        Modal,
        BaseAlert,
        LoadingButton,
    },
    props: {
        model: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
})
export default class EditProfileForm extends Vue {
    public failedSave = false;

    public get player() {
        return this.$session.state.currentUser;
    }

    async saveProfile() {
        if (this.player && this.player.isRegistered) {
            await this.player.save();
            this.failedSave = false;
        } else {
            this.failedSave = true;
        }
    }
};
</script>
<style></style>

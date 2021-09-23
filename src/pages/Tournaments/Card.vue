<template>
    <div class="tournament-card" v-if="item" :class="classes" @click="onClick()">
        <div class="link-tile-title text-center">{{ item.title.toUpperCase() }}</div>
        <card
            style="padding-top: 100%"
            text-variant="light"
            bg-variant="secondary"
            class="tournament-card"
            :style="`background-image: url(${item.logo ? item.logo + '?h=250' : ''});`"
        >
            <!-- <img
                @click="
                "
                slot="image-bottom"
                class="card-img-bottom"
                :src="item.logo ? item.logo + '' : ''"
            /> -->

            <!-- {{ item.introduction }} -->
        </card>
    </div>
</template>

<script lang="ts">
import BaseTournament from '@/classes/BaseTournament';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    props: {
        item: {
            type: Object,
            default: () => {
                return {};
            },
        },
        classes: {
            type: String,
            default: () => {
                return '';
            },
        },
    },
})
export default class TournamentCard extends Vue {
    public item?: BaseTournament;
    public classes?: string;

    public onClick() {
        if (this.item)
            this.$router.push({
                name: 'tournament-details',
                params: { tournamentId: this.item.slug },
            });
    }
}
</script>

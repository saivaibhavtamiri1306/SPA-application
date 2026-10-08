import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({selector:'tv-profile',standalone:true,imports:[CommonModule],templateUrl:'./profile.component.html'})
export class ProfileComponent { readonly auth=inject(AuthService); readonly i18n=inject(I18nService); }

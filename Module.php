<?php
/**
 * @copyright Copyright (c) 2017, Afterlogic Corp.
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

namespace Aurora\Modules\LogsViewerWebclient;

/**
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
	public function GetUsersWithSeparateLog()
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->GetUsersWithSeparateLog();
	}
	
	public function TurnOffSeparateLogs()
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->TurnOffSeparateLogs();
	}
	
	public function ClearSeparateLogs()
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->ClearSeparateLogs();
	}

	public function GetLogFilesData()
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->GetLogFilesData();
	}
	
	public function GetLogFile($EventsLog = false, $PublicId = '')
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->GetLogFile($EventsLog, $PublicId);
	}
	
	public function GetLog($EventsLog, $PartSize = 10240)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->GetLog($EventsLog, $PartSize);
	}
	
	public function ClearLog($EventsLog)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->ClearLog($EventsLog);
	}
}

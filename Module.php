<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\LogsViewerWebclient;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 *
 * @property Settings $oModuleSettings
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
    /**
     *
     * @return Module
     */
    public static function Decorator()
    {
        return parent::Decorator();
    }

    /**
     *
     * @return Settings
     */
    public function getModuleSettings()
    {
        return $this->oModuleSettings;
    }

    public function GetSettings()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);

        return array(
            'ViewLastLogSize' => $this->oModuleSettings->ViewLastLogSize
        );
    }

    public function GetUsersWithSeparateLog()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);
        return \Aurora\Modules\Core\Module::Decorator()->GetUsersWithSeparateLog();
    }

    public function TurnOffSeparateLogs()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);
        return \Aurora\Modules\Core\Module::Decorator()->TurnOffSeparateLogs();
    }

    public function ClearSeparateLogs()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);
        return \Aurora\Modules\Core\Module::Decorator()->ClearSeparateLogs();
    }

    public function GetLogFilesData()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);
        return \Aurora\Modules\Core\Module::Decorator()->GetLogFilesData();
    }

    public function GetLogFile($EventsLog = false, $PublicId = '')
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);
        return \Aurora\Modules\Core\Module::Decorator()->GetLogFile($EventsLog, $PublicId);
    }

    public function GetLog($EventsLog)
    {
        $PartSize = $this->oModuleSettings->ViewLastLogSize;
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);
        return \Aurora\Modules\Core\Module::Decorator()->GetLog($EventsLog, $PartSize);
    }

    public function ClearLog($EventsLog)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);
        return \Aurora\Modules\Core\Module::Decorator()->ClearLog($EventsLog);
    }
}

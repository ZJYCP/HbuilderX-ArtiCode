import React, { useEffect, useMemo } from 'react';
import { useUserStore } from '../../store';
import { useNavigate } from 'react-router';
import { useMemoizedFn } from 'ahooks';
import request from '../../utils/request';
import {
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { SquarePlus, LogOut } from 'lucide-react';
import { eventBus } from '../../utils/eventBus';
import { ExtMessageType } from '../../../utils/extType';
import useSendMessage from '../../hooks/useSendMessage';

export default function HeaderCom() {
  const { sendHandler } = useSendMessage();

  const { token, userInfo, setUserInfo } = useUserStore();
  const navigate = useNavigate();

  const hasLogin = useMemo(() => {
    return !!token && userInfo;
  }, [token, userInfo]);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!userInfo && token) {
        const userInfo = (
          await request({
            url: '/users/userInfo',
            method: 'GET',
          })
        ).data;
        setUserInfo(userInfo);
      }
    };
    fetchInfo();
  }, [token]);

  const handleNewChat = useMemoizedFn(() => {
    eventBus.emit('new-chat');
  });

  const handleLogout = useMemoizedFn(() => {
    // 这里添加退出登录的逻辑
    setUserInfo(null);
    localStorage.removeItem('token');
    sendHandler({
      type: ExtMessageType.SIGNOUT,
      data: {},
    });
    // 刷新页面
    window.location.reload();
  });

  return (
    <div className="h-8 flex justify-between items-center mx-1">
      <span className="font-bold">ArtiCode</span>
      {hasLogin ? (
        <div className="flex gap-2 items-center">
          <Tooltip color="foreground" content="新会话" showArrow>
            <SquarePlus
              size={20}
              className="cursor-pointer focus:outline-none"
              onClick={handleNewChat}
            ></SquarePlus>
          </Tooltip>
          <Tooltip
            color="default"
            content={
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                <span>退出登录</span>
              </div>
            }
            showArrow
          >
            <span className="cursor-pointer">{userInfo?.email}</span>
          </Tooltip>
        </div>
      ) : (
        <div className="flex gap-2">
          <span
            className="cursor-pointer"
            onClick={() => {
              navigate('/signin');
            }}
          >
            登录
          </span>
          <span
            className="cursor-pointer"
            onClick={() => {
              navigate('/signup');
            }}
          >
            注册
          </span>
        </div>
      )}
    </div>
  );
}
